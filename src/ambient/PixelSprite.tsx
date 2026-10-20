/* Crisp pixel-art rendering for ambient objects. Characters map to colors
   through `palette`; "." (or any character missing from the palette) is
   transparent. Pixels are drawn as 1x1 rects on an integer grid with
   `shapeRendering: crispEdges`, so the art stays sharp at any scale. */

export interface PixelSpriteProps {
  /** One string per row, one character per pixel. */
  pixels: readonly string[];
  /** Character → CSS color. Characters absent here are transparent. */
  palette: Record<string, string>;
  /** Rendered size in CSS pixels. */
  width: number;
  height: number;
  className?: string;
  /** Accessible label for objects that are not wrapped in a button. */
  title?: string;
}

function PixelSprite({ pixels, palette, width, height, className, title }: PixelSpriteProps) {
  const columns = pixels.reduce((max, row) => Math.max(max, row.length), 0);
  const rows = pixels.length;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${columns} ${rows}`}
      width={width}
      height={height}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {pixels.map((row, y) =>
        row.split("").map((code, x) => {
          const fill = palette[code];
          return fill ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} /> : null;
        }),
      )}
    </svg>
  );
}

export default PixelSprite;
