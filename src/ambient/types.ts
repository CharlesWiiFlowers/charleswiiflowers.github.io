import type { ComponentType, RefObject } from "react";

/* Shared types for the ambient system. Objects are plain components that
   receive presentation/interaction props; the system owns everything else. */

/** Props handed to every ambient object component. */
export interface AmbientProps {
  /** Whether the object's popover is open. */
  open: boolean;
  /** Toggle the popover (click / Enter / Space on the trigger). */
  onToggle: () => void;
  /** `id` the trigger's `aria-controls` should point at while open. */
  popoverId: string;
  /** Attach to the object's interactive root (used for dismissal + clamping). */
  scopeRef: RefObject<HTMLDivElement>;
  /** Attach to the popover element when the object renders one. */
  popoverRef: RefObject<HTMLDivElement>;
}

export type AmbientPlacement = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface AmbientBehavior {
  /** Movement. Defaults to zero-gravity drift. */
  movement?: "drift" | "stationary";
  /** Anchor regions for drift, as fractions of the bounded area. */
  regions?: ReadonlyArray<readonly [number, number]>;
  /** Viewport padding (px) kept free on every edge. Default 16. */
  edge?: number;
  /** Minimum distance (px) from the top edge. Default 0. */
  minTop?: number;
  /** Maximum drift rotation (deg). Default 14. */
  maxTilt?: number;
  /** Corner used when the visitor prefers reduced motion. Default "bottom-right". */
  restCorner?: AmbientPlacement;
}

export interface AmbientInteraction {
  /** Close delay (ms) before movement resumes. Default 1600. */
  resumeDelay?: number;
}

/** Optional decorative accents applied to the object's trigger. */
export type AmbientAccent = "shadow" | "lift";

export interface AmbientObjectConfig {
  /** Stable identifier: React key, popover id prefix. */
  id: string;
  /** The object's visual + interactive component. */
  component: ComponentType<AmbientProps>;
  /** Rendered size in CSS pixels. */
  width: number;
  height: number;
  /** Fine-grained switch, in addition to responsive gating. Default true. */
  enabled?: boolean;
  /** Show on desktop layouts. Default true. */
  desktopOnly?: boolean;
  /** Stacking order relative to other objects. Default 0. */
  zIndex?: number;
  /** Decorative accents: soft drop shadow, gentle vertical bob. */
  accents?: readonly AmbientAccent[];
  behavior?: AmbientBehavior;
  interaction?: AmbientInteraction;
}
