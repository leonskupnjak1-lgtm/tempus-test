// A seam-softener, not a divider. Placed at the top of a section that opens
// on a hard color change from the section before it (dark → light or vice
// versa), it dissolves that section's own background color out of the
// previous one over the first stretch of scroll, so the cut never registers
// as a cut — the page reads as one continuous surface changing temperature.
export default function SectionFade({ from, height = "18vh", className = "", z = "z-[2]" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 ${z} ${className}`}
      style={{ height, background: `linear-gradient(to bottom, ${from}, transparent)` }}
    />
  );
}
