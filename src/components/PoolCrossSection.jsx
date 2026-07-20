// Signature illustration: an architectural cross-section of a pool, rendered as
// fine blueprint linework with dimension ticks. Strokes animate in on mount to
// read like a drawing being traced, then ambient caustic blobs drift behind it.

import { useEffect, useState } from "react";

export default function PoolCrossSection({ className = "" }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/3 h-[70%] w-[70%] rounded-full bg-acqua/10 blur-3xl animate-drift" />
        <div
          className="absolute -right-1/4 -top-10 h-[60%] w-[60%] rounded-full bg-travertino/10 blur-3xl animate-drift"
          style={{ animationDelay: "-9s" }}
        />
      </div>
      <svg viewBox="0 0 520 420" fill="none" className="relative h-full w-full" aria-hidden="true">
        {/* waterline */}
        <line x1="40" y1="120" x2="480" y2="120" stroke="var(--color-acqua)" strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />
        <text x="46" y="112" fill="var(--color-acqua)" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
          RAZINA VODE
        </text>

        {/* pool shell */}
        <path
          d="M60 120 L60 300 Q60 320 80 320 L440 320 Q460 320 460 300 L460 120"
          stroke="var(--color-travertino)"
          strokeWidth="2"
          pathLength="1"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: "stroke-dashoffset 1.8s ease",
          }}
        />

        {/* water fill lines */}
        {[140, 160, 180, 200, 220, 240, 260, 280].map((y, i) => (
          <line
            key={y}
            x1="64"
            y1={y}
            x2="456"
            y2={y}
            stroke="var(--color-acqua)"
            strokeWidth="0.6"
            opacity={drawn ? 0.14 : 0}
            style={{ transition: `opacity 0.8s ease ${0.4 + i * 0.05}s` }}
          />
        ))}

        {/* steps */}
        <path
          d="M60 240 h30 v20 h30 v20 h30 v40"
          stroke="var(--color-acqua-soft)"
          strokeWidth="1.4"
          opacity={drawn ? 0.9 : 0}
          style={{ transition: "opacity 1s ease 1.2s" }}
        />

        {/* filtration arrow */}
        <path
          d="M460 200 C500 200 500 160 470 150"
          stroke="var(--color-sabbia)"
          strokeWidth="1.2"
          markerEnd="url(#arrow)"
          opacity={drawn ? 0.85 : 0}
          style={{ transition: "opacity 1s ease 1.6s" }}
        />
        <text
          x="472"
          y="188"
          fill="var(--color-sabbia)"
          fontSize="9"
          fontFamily="var(--font-mono)"
          opacity={drawn ? 0.85 : 0}
          style={{ transition: "opacity 1s ease 1.8s", writingMode: "vertical-rl" }}
        >
          FILTRACIJA
        </text>

        {/* dimension line */}
        <g opacity={drawn ? 0.7 : 0} style={{ transition: "opacity 1s ease 2s" }}>
          <line x1="60" y1="345" x2="460" y2="345" stroke="var(--color-travertino)" strokeWidth="0.6" />
          <line x1="60" y1="338" x2="60" y2="352" stroke="var(--color-travertino)" strokeWidth="0.6" />
          <line x1="460" y1="338" x2="460" y2="352" stroke="var(--color-travertino)" strokeWidth="0.6" />
          <text x="240" y="365" fill="var(--color-travertino)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">
            PO MJERI PROSTORA
          </text>
        </g>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="var(--color-sabbia)" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
