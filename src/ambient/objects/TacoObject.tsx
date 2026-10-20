import { useEffect, useState } from "react";
import PixelSprite from "../PixelSprite";
import type { AmbientProps } from "../types";

/* The taco: a small pixel-art taco that drifts through the viewport like a
   collectible in zero gravity. Its first click offers the recipe. */

const RECIPE_URL = "https://charleswiiflowers.github.io/HowToMakeTacosAlPastor/";

/* 16 x 12 pixel-art taco: fillings on top, folded tortilla shell below.
   One character per pixel; "." is transparent. */
const TACO_PIXELS: readonly string[] = [
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

function TacoObject({ open, onToggle, popoverId, scopeRef, popoverRef }: AmbientProps) {
  // One-shot entrance so the taco fades in instead of popping; purely visual.
  // No mounted-ref guard here: React 18 StrictMode re-runs effects in dev, and
  // a flag flipped to false by the first cleanup would strand opacity at 0.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div className="ambient-object__scope" ref={scopeRef}>
      <button
        type="button"
        className="ambient-object__trigger"
        style={{ opacity: shown ? 1 : 0, transition: "opacity 0.4s ease" }}
        aria-label="Discover the taco easter egg"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={onToggle}
      >
        <PixelSprite
          className="ambient-object__art"
          pixels={TACO_PIXELS}
          palette={TACO_COLORS}
          width={64}
          height={48}
        />
      </button>
      {open && (
        <div
          className="ambient-object__popover"
          id={popoverId}
          role="dialog"
          aria-label="Taco easter egg"
          ref={popoverRef}
        >
          <p className="ambient-object__popover-text">¿Se te antojó? 🌮</p>
          <a
            className="ambient-object__popover-action"
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

export default TacoObject;
