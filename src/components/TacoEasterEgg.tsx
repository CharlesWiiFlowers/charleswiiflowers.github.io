import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./TacoEasterEgg.css";

/* Floating taco easter egg: a small pixel-art taco drifting through the
   viewport like a collectible in zero gravity. Decorative and desktop-only.
   Movement is written straight to DOM styles on rAF-free timers, so the
   drift never causes a React re-render. */

const RECIPE_URL = "https://charleswiiflowers.github.io/HowToMakeTacosAlPastor/";
const TOOLTIP_ID = "taco-egg-tooltip";
const DESKTOP_QUERY = "(min-width: 800px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const EDGE = 16; // viewport padding for sides / bottom
const MIN_X = EDGE;
const MIN_Y = 152; // keeps the taco (and the tooltip above it) clear of the sticky navbar
const TOOLTIP_PAD = 8;
const TOOLTIP_GAP = 10;
const RESUME_DELAY = 1600;

/* 16 x 12 pixel-art taco: fillings on top, folded tortilla shell below.
   One character per pixel; "." is transparent. */
const TACO_PIXELS: string[] = [
  "...GG..rr..GG...",
  "..mgGGggrrGGgm..",
  ".mmgGgrrrrgGgmm.",
  "oooooooooooooooo",
  "ohhhhhhssgrsssso",
  "ohhhssssssssdddo",
  ".osssssssdddddo.",
  "..osssssdddddo..",
  "...ossssddddo...",
  "....osssdddo....",
  ".....ossddo.....",
  "......oooo......",
];

const TACO_COLORS: Record<string, string> = {
  o: "#40240f", // shell outline
  s: "#e9a63f", // tortilla
  h: "#f9d68a", // tortilla highlight
  d: "#c07d26", // tortilla shade
  g: "#55b04a", // lettuce
  G: "#79cf57", // lettuce, light
  r: "#dc4f3f", // tomato
  m: "#9a5a2d", // meat
};

/* Drift destinations as fractions of the available (bounded) area.
   Corners and edges first, so the taco mostly avoids dense page content. */
const REGIONS: Array<[number, number]> = [
  [0.12, 0.06],
  [0.5, 0.04],
  [0.88, 0.06],
  [0.08, 0.5],
  [0.92, 0.5],
  [0.12, 0.95],
  [0.5, 0.98],
  [0.88, 0.95],
];

interface TacoControl {
  pause: () => void;
  schedule: (delay: number) => void;
  freeze: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* Read the transform a CSS transition is currently animating towards-past
   value, so we can freeze mid-drift without a visible jump. */
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
  const is3d = raw.startsWith("matrix3d");
  if (is3d && v.length >= 14) {
    return { x: v[12], y: v[13], rot: 0 };
  }
  if (v.length >= 6) {
    return { x: v[4], y: v[5], rot: 0 };
  }
  return null;
}

function TacoSprite() {
  return (
    <svg
      className="taco-egg__sprite"
      viewBox="0 0 16 12"
      width="64"
      height="48"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {TACO_PIXELS.map((row, y) =>
        row.split("").map((code, x) =>
          code === "." ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={TACO_COLORS[code]} />
          ),
        ),
      )}
    </svg>
  );
}

function TacoEasterEgg() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;
  const prevOpenRef = useRef(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<TacoControl | null>(null);

  // Dropping to a mobile layout unmounts the widget entirely; make sure the
  // open state does not linger for a later resize back to desktop.
  useEffect(() => {
    if (!isDesktop && open) {
      setOpen(false);
    }
  }, [isDesktop, open]);

  // Zero-gravity drift loop (skipped entirely under reduced motion).
  useEffect(() => {
    if (!isDesktop) {
      return;
    }
    const root = rootRef.current;
    const tilt = tiltRef.current;
    if (!root || !tilt) {
      return;
    }

    let timer = 0;
    let lastRegion = -1;
    const pos = { x: 0, y: 0, rot: 0 };

    const bounds = () => {
      const w = root.offsetWidth || 64;
      const h = root.offsetHeight || 48;
      return {
        minX: MIN_X,
        maxX: Math.max(MIN_X, window.innerWidth - w - EDGE),
        minY: MIN_Y,
        maxY: Math.max(MIN_Y, window.innerHeight - h - EDGE),
      };
    };

    const apply = (x: number, y: number, rot: number, durationMs: number) => {
      pos.x = x;
      pos.y = y;
      pos.rot = rot;
      root.style.transitionDuration = `${durationMs}ms`;
      tilt.style.transitionDuration = `${durationMs}ms`;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      tilt.style.transform = `rotate(${rot}deg)`;
    };

    const pick = () => {
      const b = bounds();
      let idx = Math.floor(Math.random() * REGIONS.length);
      while (REGIONS.length > 1 && idx === lastRegion) {
        idx = Math.floor(Math.random() * REGIONS.length);
      }
      lastRegion = idx;
      const fx = clamp(REGIONS[idx][0] + (Math.random() * 2 - 1) * 0.09, 0, 1);
      const fy = clamp(REGIONS[idx][1] + (Math.random() * 2 - 1) * 0.1, 0, 1);
      const x = b.minX + fx * (b.maxX - b.minX);
      const y = b.minY + fy * (b.maxY - b.minY);
      const rot = clamp(pos.rot + (Math.random() * 2 - 1) * 10, -14, 14);
      const dist = Math.hypot(x - pos.x, y - pos.y);
      const dur = Math.round(clamp(8000 + dist * 8, 9000, 20000));
      return { x, y, rot, dur };
    };

    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (openRef.current) {
          return; // paused; rescheduled when the tooltip closes
        }
        const target = pick();
        apply(target.x, target.y, target.rot, target.dur);
        schedule(target.dur + 2500 + Math.random() * 3500);
      }, delay);
    };

    const freeze = () => {
      const current = readTransform(root, "translate") ?? { x: pos.x, y: pos.y, rot: 0 };
      const rotation = readTransform(tilt, "rotate") ?? { x: 0, y: 0, rot: pos.rot };
      apply(current.x, current.y, rotation.rot, 0);
    };

    if (reducedMotion) {
      // Stationary, unobtrusive corner placement; still fully interactive.
      const placeStatic = () => {
        const b = bounds();
        apply(b.maxX, b.maxY, 0, 0);
      };
      placeStatic();
      const onResize = () => placeStatic();
      window.addEventListener("resize", onResize);
      controlRef.current = { pause: () => {}, schedule: () => {}, freeze: placeStatic };
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("resize", onResize);
        controlRef.current = null;
      };
    }

    // First placement is instant, so the taco never slides in from a corner.
    const first = pick();
    apply(first.x, first.y, first.rot, 0);
    root.getBoundingClientRect();

    const onResize = () => {
      if (openRef.current) {
        // Frozen: snap back inside the new bounds without animating.
        const b = bounds();
        apply(clamp(pos.x, b.minX, b.maxX), clamp(pos.y, b.minY, b.maxY), pos.rot, 0);
        return;
      }
      schedule(500); // retarget smoothly from wherever the drift currently is
    };

    controlRef.current = { pause: () => window.clearTimeout(timer), schedule, freeze };
    schedule(2500 + Math.random() * 2500);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      controlRef.current = null;
    };
  }, [isDesktop, reducedMotion]);

  // Pause / resume the drift while the tooltip is shown.
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;
    if (!isDesktop) {
      return;
    }
    if (open) {
      controlRef.current?.pause();
      controlRef.current?.freeze();
    } else if (wasOpen) {
      controlRef.current?.schedule(RESUME_DELAY);
    }
  }, [open, isDesktop]);

  // Dismiss on outside pointerdown, Escape, or focus leaving the widget.
  useEffect(() => {
    if (!open) {
      return;
    }
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!root.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setOpen(false);
      if (root.contains(document.activeElement)) {
        root.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!root.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  // Keep the tooltip inside the viewport, whatever edge the taco is near.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const tip = tipRef.current;
    const root = rootRef.current;
    if (!tip || !root) {
      return;
    }
    const clampTip = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rootRect = root.getBoundingClientRect();
      const size = tip.getBoundingClientRect();
      const below = rootRect.top - TOOLTIP_PAD < size.height + TOOLTIP_GAP;
      tip.classList.toggle("taco-egg__tip--below", below);
      const rect = tip.getBoundingClientRect();
      let dx = 0;
      if (rect.left < TOOLTIP_PAD) {
        dx = TOOLTIP_PAD - rect.left;
      } else if (rect.right > vw - TOOLTIP_PAD) {
        dx = vw - TOOLTIP_PAD - rect.right;
      }
      let dy = 0;
      if (rect.top < TOOLTIP_PAD) {
        dy = TOOLTIP_PAD - rect.top;
      } else if (rect.bottom > vh - TOOLTIP_PAD) {
        dy = vh - TOOLTIP_PAD - rect.bottom;
      }
      tip.style.transform = `translate(calc(-50% + ${dx}px), ${dy}px)`;
    };
    clampTip();
    const onResize = () => clampTip();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  if (!isDesktop) {
    return null;
  }

  return (
    <div className="taco-egg" ref={rootRef}>
      <div className="taco-egg__tilt" ref={tiltRef}>
        <button
          type="button"
          className="taco-egg__btn"
          aria-label="Discover the taco easter egg"
          aria-expanded={open}
          aria-controls={open ? TOOLTIP_ID : undefined}
          onClick={() => setOpen((prev) => !prev)}
        >
          <TacoSprite />
        </button>
      </div>
      {open && (
        <div className="taco-egg__tip" id={TOOLTIP_ID} role="dialog" aria-label="Taco easter egg" ref={tipRef}>
          <p className="taco-egg__tip-text">¿Se te antojó? 🌮</p>
          <a
            className="taco-egg__tip-link"
            href={RECIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver la receta (opens in a new tab)"
          >
            Ver la receta ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default TacoEasterEgg;
