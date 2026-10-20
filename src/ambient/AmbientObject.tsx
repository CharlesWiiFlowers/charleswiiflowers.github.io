import { useRef } from "react";
import { useDrift } from "./behaviors/useDrift";
import { usePopover } from "./behaviors/usePopover";
import type { AmbientObjectConfig } from "./types";

/* Renders one ambient object. The object component owns its appearance; this
   wrapper owns placement, motion, interaction wiring and accessibility
   layering, so objects stay small and consistent. */

interface AmbientObjectProps {
  config: AmbientObjectConfig;
  /** Whether the object should render at all (responsive gating applied). */
  active: boolean;
  /** Whether the visitor prefers reduced motion. */
  reducedMotion: boolean;
}

function AmbientObject({ config, active, reducedMotion }: AmbientObjectProps) {
  const { id, component: Component, width, height, zIndex = 0, accents = [] } = config;
  const behavior = config.behavior ?? {};
  const movement = behavior.movement ?? "drift";

  // Movement writes transforms to these refs; pauseRef lets an open popover
  // hold the object still without re-running the drift effect.
  const rootRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);
  const controlRef = useDrift(rootRef, motionRef, pauseRef, {
    enabled: active && movement === "drift",
    reducedMotion,
    regions: behavior.regions,
    edge: behavior.edge ?? 16,
    minTop: behavior.minTop ?? 0,
    maxTilt: behavior.maxTilt ?? 14,
    restCorner: behavior.restCorner ?? "bottom-right",
  });

  const popover = usePopover({
    enabled: active,
    resumeDelay: config.interaction?.resumeDelay ?? 1600,
    onPause: () => {
      pauseRef.current = true;
      controlRef.current?.freeze();
    },
    onResume: (delay) => {
      pauseRef.current = false;
      controlRef.current?.resume(delay);
    },
  });
  pauseRef.current = popover.open;

  const className = ["ambient-object", ...accents.map((accent) => `ambient-object--${accent}`)].join(" ");

  return (
    <div ref={rootRef} className={className} style={{ width, height, zIndex }}>
      <div ref={motionRef} className="ambient-object__motion">
        <Component
          open={popover.open}
          onToggle={popover.toggle}
          popoverId={`ambient-${id}-popover`}
          scopeRef={popover.scopeRef}
          popoverRef={popover.popoverRef}
        />
      </div>
    </div>
  );
}

export default AmbientObject;
