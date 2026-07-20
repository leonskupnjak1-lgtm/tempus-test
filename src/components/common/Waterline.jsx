// The site's signature motif: the water's surface, rendered as a thin line
// that never sits quite still. Used at every section seam instead of a hard
// divider, and as a fixed scroll-progress rail — the waterline rising as you
// move through the page.

import { useId } from "react";
import { motion, useScroll } from "motion/react";

export default function Waterline({ className = "", opacity = 0.55 }) {
  const rawId = useId().replace(/:/g, "");

  return (
    <div className={`relative h-px w-full ${className}`} aria-hidden="true">
      <svg className="absolute inset-x-0 -top-2 h-4 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 8">
        <defs>
          <filter id={`ripple-${rawId}`} x="-20%" y="-300%" width="140%" height="700%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.5" numOctaves="1" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="16s" values="0.018 0.5;0.032 0.5;0.018 0.5" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <line
          x1="0"
          y1="4"
          x2="100"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity={opacity}
          filter={`url(#ripple-${rawId})`}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export function WaterlineRail() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden w-px lg:block" aria-hidden="true">
      <div className="h-full w-full bg-ink/[0.06]" />
      <motion.div className="absolute inset-x-0 top-0 h-full w-px origin-top bg-acqua" style={{ scaleY: scrollYProgress }} />
    </div>
  );
}
