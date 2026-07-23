// The sticky visual for the Technology story: one engineering cutaway of the
// pool and its plant room, rendered as fine blueprint linework (same register
// as PoolCrossSection). Six components — three underground, three in the
// pool itself — sit as quiet, dimmed hotspots. Only the one matching
// `activeKey` lights up: a soft pulse, a short leader line drawn outward, and
// a mono label naming it. Nothing else moves, so the single active node
// reads clearly against six years' worth of engineering hidden in one shell.

import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1];

// cx/cy in the 440×620 viewBox below. leader is the (dx, dy) offset from the
// dot to where its label chip sits — chosen per-node so labels never run off
// the canvas or cross the shell linework.
const HOTSPOTS = {
  okolis: { cx: 230, cy: 112, leader: [34, -14], anchor: "start", num: "06" },
  rasvjeta: { cx: 358, cy: 232, leader: [30, 8], anchor: "start", num: "05" },
  ciscenje: { cx: 184, cy: 378, leader: [-30, 26], anchor: "end", num: "04" },
  filtracija: { cx: 278, cy: 469, leader: [46, -10], anchor: "start", num: "01" },
  grijanje: { cx: 278, cy: 513, leader: [46, 0], anchor: "start", num: "02" },
  kemija: { cx: 278, cy: 557, leader: [46, 10], anchor: "start", num: "03" },
};

function Hotspot({ hotspotKey, label, active, drawn }) {
  const h = HOTSPOTS[hotspotKey];
  const [ldx, ldy] = h.leader;
  const lx = h.cx + ldx;
  const ly = h.cy + ldy;

  return (
    <g style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.6s ease" }}>
      {active && (
        <motion.circle
          cx={h.cx}
          cy={h.cy}
          r={9}
          fill="none"
          stroke="var(--color-acqua)"
          strokeWidth="1"
          animate={{ opacity: [0.55, 0, 0.55], scale: [0.8, 1.5, 0.8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${h.cx}px ${h.cy}px` }}
        />
      )}
      <motion.circle
        cx={h.cx}
        cy={h.cy}
        r={3.2}
        fill={active ? "var(--color-acqua)" : "var(--color-travertino)"}
        animate={{ opacity: active ? 1 : 0.3, scale: active ? 1.15 : 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ transformOrigin: `${h.cx}px ${h.cy}px` }}
      />

      <motion.g
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: active ? 0.15 : 0 }}
      >
        <motion.line
          x1={h.cx}
          y1={h.cy}
          x2={lx}
          y2={ly}
          stroke="var(--color-acqua)"
          strokeWidth="0.8"
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
        <text
          x={lx + (h.anchor === "end" ? -7 : 7)}
          y={ly + 3}
          textAnchor={h.anchor}
          fill="var(--color-acqua-soft)"
          fontSize="9.5"
          fontFamily="var(--font-mono)"
          letterSpacing="0.06em"
        >
          {h.num} — {label}
        </text>
      </motion.g>
    </g>
  );
}

const LABELS = {
  filtracija: "FILTRACIJA",
  grijanje: "GRIJANJE",
  kemija: "KEMIJA",
  ciscenje: "ČIŠĆENJE",
  rasvjeta: "RASVJETA",
  okolis: "OKOLIŠ",
};

export default function PoolSystemsBlueprint({ activeKey, drawn }) {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-[65%] w-[65%] rounded-full bg-acqua/[0.07] blur-3xl animate-drift" />
        <div
          className="absolute -right-1/4 bottom-0 h-[55%] w-[55%] rounded-full bg-travertino/[0.05] blur-3xl animate-drift"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <svg viewBox="0 0 440 620" fill="none" className="relative h-full w-full" aria-hidden="true">
        {/* waterline */}
        <line x1="40" y1="130" x2="400" y2="130" stroke="var(--color-acqua)" strokeWidth="1" strokeDasharray="2 5" opacity="0.6" />
        <text x="46" y="122" fill="var(--color-acqua)" fontSize="9.5" fontFamily="var(--font-mono)" letterSpacing="1">
          RAZINA VODE
        </text>

        {/* shell */}
        <path
          d="M70 130 L70 360 Q70 385 95 385 L345 385 Q370 385 370 360 L370 130"
          stroke="var(--color-travertino)"
          strokeWidth="2"
          pathLength="1"
          style={{ strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, transition: "stroke-dashoffset 1.8s ease" }}
        />

        {/* water fill lines */}
        {[160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((y, i) => (
          <line
            key={y}
            x1="76"
            y1={y}
            x2="364"
            y2={y}
            stroke="var(--color-acqua)"
            strokeWidth="0.6"
            opacity={drawn ? 0.13 : 0}
            style={{ transition: `opacity 0.8s ease ${0.4 + i * 0.05}s` }}
          />
        ))}

        {/* entry steps */}
        <path
          d="M70 296 h26 v18 h26 v18 h26 v53"
          stroke="var(--color-acqua-soft)"
          strokeWidth="1.4"
          opacity={drawn ? 0.85 : 0}
          style={{ transition: "opacity 1s ease 1.2s" }}
        />

        {/* edge / safety rail (okoliš i sigurnost) */}
        <g opacity={drawn ? 0.8 : 0} style={{ transition: "opacity 1s ease 1.3s" }}>
          <path d="M212 118v-16M248 118v-16M212 102h36" stroke="var(--color-travertino)" strokeWidth="1.2" />
        </g>

        {/* underwater light fixture (rasvjeta i wellness) */}
        <g opacity={drawn ? 0.85 : 0} style={{ transition: "opacity 1s ease 1.4s" }}>
          <circle cx="358" cy="232" r="6" stroke="var(--color-sabbia)" strokeWidth="1" />
          <circle cx="358" cy="232" r="1.6" fill="var(--color-sabbia)" />
        </g>

        {/* cleaning robot on the floor (čišćenje) */}
        <g opacity={drawn ? 0.85 : 0} style={{ transition: "opacity 1s ease 1.5s" }}>
          <rect x="172" y="373" width="24" height="9" rx="3" stroke="var(--color-travertino)" strokeWidth="1.2" />
          <circle cx="178" cy="386" r="2" fill="var(--color-travertino)" />
          <circle cx="190" cy="386" r="2" fill="var(--color-travertino)" />
        </g>

        {/* connecting pipe: shell outlet → plant room */}
        <path
          d="M110 385 v18 h178 v17"
          stroke="var(--color-acqua)"
          strokeWidth="1.4"
          strokeDasharray="1 6"
          opacity={drawn ? 0.4 : 0}
          className="motion-safe:animate-[pipe-flow_6s_linear_infinite]"
          style={{ transition: "opacity 1s ease 1.6s" }}
        />

        {/* plant room */}
        <g opacity={drawn ? 1 : 0} style={{ transition: "opacity 0.8s ease 1.7s" }}>
          <rect x="250" y="420" width="150" height="176" rx="6" stroke="var(--color-travertino)" strokeWidth="1" strokeDasharray="1 4" opacity="0.35" />
          <text x="262" y="438" fill="var(--color-travertino)" fontSize="8.5" fontFamily="var(--font-mono)" letterSpacing="0.14em" opacity="0.4">
            STROJARNICA
          </text>

          {[452, 496, 540].map((y) => (
            <rect key={y} x="266" y={y} width="118" height="34" rx="4" stroke="var(--color-travertino)" strokeWidth="1" opacity="0.28" />
          ))}
        </g>

        {Object.keys(HOTSPOTS).map((key) => (
          <Hotspot key={key} hotspotKey={key} label={LABELS[key]} active={activeKey === key} drawn={drawn} />
        ))}
      </svg>

      <style>{`
        @keyframes pipe-flow {
          to { stroke-dashoffset: -28; }
        }
      `}</style>
    </div>
  );
}
