import TacoObject from "./objects/TacoObject";
import type { AmbientObjectConfig } from "./types";

/* The ambient registry: the single place to add another object.
   Each entry declares only what it needs; everything else falls back to
   sensible defaults (drift movement, desktop-only, bottom-right rest). */
export const ambientObjects: AmbientObjectConfig[] = [
  {
    id: "taco",
    component: TacoObject,
    width: 64,
    height: 48,
    accents: ["shadow", "lift"],
    // Keep the drifting taco (and its popover, which floats above it) clear of
    // the sticky navbar.
    behavior: { minTop: 152 },
  },
];
