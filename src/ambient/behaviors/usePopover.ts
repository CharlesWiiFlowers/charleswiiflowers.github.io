import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/* Reusable popover behavior for ambient objects: open state, dismissal
   (outside pointer, Escape, focus-out), viewport clamping, and pause/resume
   hooks so a drifting object holds still while its popover is open. */

export interface PopoverOptions {
  /** Whether the interaction layer is active at all (responsive gating). */
  enabled: boolean;
  /** Delay before signaling `onResume` after closing. Default 1600ms. */
  resumeDelay?: number;
  /** Called when the popover opens. */
  onPause?: () => void;
  /** Called when the popover is dismissed, after `resumeDelay`. */
  onResume?: (delay: number) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export interface Popover {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Attach to the interactive root element. */
  scopeRef: RefObject<HTMLDivElement>;
  /** Attach to the popover element (used for viewport clamping). */
  popoverRef: RefObject<HTMLDivElement>;
}

const VIEWPORT_PAD = 8;
const POPOVER_GAP = 10;

export function usePopover(options: PopoverOptions): Popover {
  const { enabled, resumeDelay = 1600, onPause, onResume } = options;
  const [open, setOpen] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Callbacks live in refs so the effects below never re-subscribe on render.
  const onPauseRef = useRef(onPause);
  const onResumeRef = useRef(onResume);
  onPauseRef.current = onPause;
  onResumeRef.current = onResume;

  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  // Disabling the system (e.g. shrinking to mobile) must not leave a
  // lingering open popover behind.
  useEffect(() => {
    if (!enabled && open) {
      setOpen(false);
    }
  }, [enabled, open]);

  // Dismiss on outside pointerdown, Escape, or focus leaving the object.
  useEffect(() => {
    if (!open) {
      return;
    }
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!scope.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setOpen(false);
      if (scope.contains(document.activeElement)) {
        scope.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!scope.contains(event.target as Node)) {
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

  // Pause the movement while open, resume shortly after closing.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (!enabled) {
      return;
    }
    if (open) {
      onPauseRef.current?.();
    } else if (wasOpen) {
      onResumeRef.current?.(resumeDelay);
    }
  }, [open, enabled, resumeDelay]);

  // Keep the popover inside the viewport, whatever edge the object is near.
  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const popover = popoverRef.current;
    const scope = scopeRef.current;
    if (!popover || !scope) {
      return;
    }
    const place = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scopeRect = scope.getBoundingClientRect();
      const natural = popover.getBoundingClientRect();
      const below = scopeRect.top - VIEWPORT_PAD < natural.height + POPOVER_GAP;
      popover.classList.toggle("ambient-object__popover--below", below);
      const rect = popover.getBoundingClientRect();
      const dx = rect.left < VIEWPORT_PAD
        ? VIEWPORT_PAD - rect.left
        : rect.right > vw - VIEWPORT_PAD
          ? vw - VIEWPORT_PAD - rect.right
          : 0;
      const dy = rect.top < VIEWPORT_PAD
        ? VIEWPORT_PAD - rect.top
        : rect.bottom > vh - VIEWPORT_PAD
          ? vh - VIEWPORT_PAD - rect.bottom
          : 0;
      popover.style.transform = `translate(calc(-50% + ${clamp(dx, -vw, vw)}px), ${clamp(dy, -vh, vh)}px)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, popoverRef, scopeRef]);

  return { open, toggle, close, scopeRef, popoverRef };
}
