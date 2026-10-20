import { useMemo } from "react";
import AmbientObject from "./AmbientObject";
import { useMediaQuery } from "./useMediaQuery";
import { ambientObjects } from "./registry";
import type { AmbientObjectConfig, AmbientPlacement } from "./types";
import "./ambient.css";

/* The ambient system's entry point. It owns the shared viewport/responsive
   constraints (desktop-only via the project's existing breakpoint) and the
   reduced-motion decision, then hands each object to AmbientObject. Adding an
   object means adding one registry entry — not touching this file. */

const DESKTOP_QUERY = "(min-width: 800px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/* Resting corners, spread so a second object does not sit on top of the first
   when motion is reduced. Objects can override this per config. */
const REST_CORNERS: readonly AmbientPlacement[] = ["bottom-right", "bottom-left", "top-right", "top-left"];

function AmbientField() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const objects = useMemo(
    () =>
      ambientObjects
        .filter((config) => config.enabled !== false)
        .filter((config) => !(config.desktopOnly ?? true) || isDesktop)
        .map((config, index) => ({
          config: {
            ...config,
            behavior: {
              restCorner: REST_CORNERS[index % REST_CORNERS.length],
              ...config.behavior,
            },
          } satisfies AmbientObjectConfig,
          reducedMotion,
        })),
    [isDesktop, reducedMotion],
  );

  if (objects.length === 0) {
    return null;
  }

  return (
    <div className="ambient-field">
      {objects.map(({ config, reducedMotion: objectReducedMotion }) => (
        <AmbientObject key={config.id} config={config} active reducedMotion={objectReducedMotion} />
      ))}
    </div>
  );
}

export default AmbientField;
