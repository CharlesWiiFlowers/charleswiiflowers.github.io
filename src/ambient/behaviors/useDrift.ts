import { useEffect, useRef } from "react";
import type { MutableRefObject, RefObject } from "react";

/* Zero-gravity drift: the object eases between "safe" anchor regions of the
   viewport, rotating slightly and moving slowly enough to read as floating.
   Transforms are written straight to the DOM on timers, so the continuous
   animation never triggers a React render. */

export type DriftRegion = readonly [number, number];

export interface DriftOptions {
  /** Whether the behavior is active (the system handles responsive gating). */
  enabled: boolean;
  /** When true, the object is parked in a corner instead of drifting. */
  reducedMotion?: boolean;
  /** Anchor points as fractions of the bounded area. Defaults to a calm ring. */
  regions?: readonly DriftRegion[];
  /** Viewport padding (px) kept free on every edge. Default 16. */
  edge?: number;
  /** Minimum distance (px) from the top edge. Default 0. */
  minTop?: number;
  /** Maximum rotation (deg) applied by the drift. Default 14. */
  maxTilt?: number;
  /** Corner used when `reducedMotion` is set. Default "bottom-right". */
  restCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface DriftControl {
  /** Stop the drift and hold the object where it is. */
  pause: () => void;
  /** Continue drifting after `delay` ms. */
  resume: (delay: number) => void;
  /** Commit the mid-transition position so a paused object does not jump. */
  freeze: () => void;
}

const DEFAULT_REGIONS: readonly DriftRegion[] = [
  [0.12, 0.06],
  [0.5, 0.04],
  [0.88, 0.06],
  [0.08, 0.5],
  [0.92, 0.5],
  [0.12, 0.95],
  [0.5, 0.98],
  [0.88, 0.95],
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/* Read the transform a CSS transition is animating right now, so a paused
   object can adopt that exact value without a visible jump. */
function readTransform(el: HTMLElement, kind: "translate" | "rotate"): { x: number; y: number; rot: number } | null {
  const raw = window.getComputedStyle(el).transform;
  if (!raw || raw === "none") {
    return null;
  }
  const nums = raw.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!nums || nums.length < 2) {
    return null;
  }
  const v = nums.map(Number);
  if (kind === "rotate") {
    return { x: 0, y: 0, rot: (Math.atan2(v[1], v[0]) * 180) / Math.PI };
  }
  if (raw.startsWith("matrix3d") && v.length >= 14) {
    return { x: v[12], y: v[13], rot: 0 };
  }
  if (v.length >= 6) {
    return { x: v[4], y: v[5], rot: 0 };
  }
  return null;
}

export function useDrift(
  rootRef: RefObject<HTMLElement>,
  motionRef: RefObject<HTMLElement>,
  pauseRef: RefObject<boolean>,
  options: DriftOptions,
): MutableRefObject<DriftControl | null> {
  const controlRef = useRef<DriftControl | null>(null);
  const { enabled, reducedMotion = false, minTop = 0, maxTilt = 14, restCorner = "bottom-right" } = options;
  const edge = options.edge ?? 16;
  const regions = options.regions ?? DEFAULT_REGIONS;

  useEffect(() => {
    const root = rootRef.current;
    const motion = motionRef.current;
    if (!enabled || !root || !motion) {
      return;
    }

    let timer = 0;
    let lastRegion = -1;
    const pos = { x: 0, y: 0, rot: 0 };

    const bounds = () => {
      const w = root.offsetWidth || 64;
      const h = root.offsetHeight || 48;
      return {
        minX: edge,
        maxX: Math.max(edge, window.innerWidth - w - edge),
        minY: minTop,
        maxY: Math.max(minTop, window.innerHeight - h - edge),
      };
    };

    const apply = (x: number, y: number, rot: number, durationMs: number) => {
      pos.x = x;
      pos.y = y;
      pos.rot = rot;
      root.style.transitionDuration = `${durationMs}ms`;
      motion.style.transitionDuration = `${durationMs}ms`;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      motion.style.transform = `rotate(${rot}deg)`;
    };

    const pick = () => {
      const b = bounds();
      let idx = Math.floor(Math.random() * regions.length);
      while (regions.length > 1 && idx === lastRegion) {
        idx = Math.floor(Math.random() * regions.length);
      }
      lastRegion = idx;
      const fx = clamp(regions[idx][0] + (Math.random() * 2 - 1) * 0.09, 0, 1);
      const fy = clamp(regions[idx][1] + (Math.random() * 2 - 1) * 0.1, 0, 1);
      const x = b.minX + fx * (b.maxX - b.minX);
      const y = b.minY + fy * (b.maxY - b.minY);
      const rot = clamp(pos.rot + (Math.random() * 2 - 1) * 10, -maxTilt, maxTilt);
      const dist = Math.hypot(x - pos.x, y - pos.y);
      const dur = Math.round(clamp(8000 + dist * 8, 9000, 20000));
      return { x, y, rot, dur };
    };

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (pauseRef.current) {
          return; // paused; rescheduled when the interaction closes
        }
        const target = pick();
        apply(target.x, target.y, target.rot, target.dur);
        schedule(target.dur + 2500 + Math.random() * 3500);
      }, delay);
    };

    const freeze = () => {
      const current = readTransform(root, "translate") ?? { x: pos.x, y: pos.y, rot: 0 };
      const rotation = readTransform(motion, "rotate") ?? { x: 0, y: 0, rot: pos.rot };
      apply(current.x, current.y, rotation.rot, 0);
    };

    const placeCorner = () => {
      const b = bounds();
      const x = restCorner.includes("left") ? b.minX : b.maxX;
      const y = restCorner.includes("top") ? b.minY : b.maxY;
      apply(x, y, 0, 0);
    };

    if (reducedMotion) {
      // Stationary, unobtrusive placement; still fully interactive.
      placeCorner();
      const onResize = () => placeCorner();
      window.addEventListener("resize", onResize);
      controlRef.current = { pause: () => {}, resume: () => {}, freeze: placeCorner };
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("resize", onResize);
        controlRef.current = null;
      };
    }

    // First placement is instant, so the object never slides in from a corner.
    const first = pick();
    apply(first.x, first.y, first.rot, 0);
    root.getBoundingClientRect();

    const onResize = () => {
      if (pauseRef.current) {
        // Frozen: snap back inside the new bounds without animating.
        const b = bounds();
        apply(clamp(pos.x, b.minX, b.maxX), clamp(pos.y, b.minY, b.maxY), pos.rot, 0);
        return;
      }
      schedule(500); // retarget smoothly from wherever the drift currently is
    };

    controlRef.current = { pause: () => window.clearTimeout(timer), resume: schedule, freeze };
    schedule(2500 + Math.random() * 2500);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      controlRef.current = null;
    };
  }, [rootRef, motionRef, pauseRef, enabled, reducedMotion, edge, minTop, maxTilt, restCorner, regions]);

  return controlRef;
}
