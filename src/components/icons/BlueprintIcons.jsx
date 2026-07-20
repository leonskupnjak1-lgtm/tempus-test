// Custom line-art icon set drawn in the site's "engineering blueprint" register —
// thin uniform strokes, no fills, slightly technical/diagrammatic rather than glyph-style.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconTrowel(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M8 32 24 16a4 4 0 0 1 5.6 0l.4.4a4 4 0 0 1 0 5.6L14 38" />
      <path d="M24 16l-6-6M18 10l6-6 6 6-6 6" />
      <circle cx="10.5" cy="29.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGauge(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="14" />
      <path d="M20 20 27 12" />
      <path d="M11 25a10 10 0 0 1 18 0" strokeDasharray="1.5 3.4" />
      <circle cx="20" cy="20" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWrench(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M26.8 13.2a6 6 0 0 1-7.9 7.9L10 30l-2-2 8.9-8.9a6 6 0 0 1 7.9-7.9l-3.9 3.9 2 2z" />
    </svg>
  );
}

export function IconDroplet(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M20 6c5 7 10 13.2 10 18.5A10 10 0 1 1 10 24.5C10 19.2 15 13 20 6z" />
      <path d="M14.5 25a5.5 5.5 0 0 0 5.5 5.5" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M20 5.5 32 10v9.5c0 8-5.3 13.6-12 15-6.7-1.4-12-7-12-15V10z" />
      <path d="M14.5 20 18.5 24 26 15.5" />
    </svg>
  );
}

export function IconClock(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="14" />
      <path d="M20 12v8l6 4" />
    </svg>
  );
}

export function IconRuler(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <rect x="6" y="16" width="28" height="8" rx="1.5" transform="rotate(-20 20 20)" />
      <path d="M13.5 15.3l1.4 2.7M18.7 13.1l1.4 2.7M23.9 10.9l1.4 2.7" />
    </svg>
  );
}

export function IconLeaf(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M9 30C7 17 18 8 31 9c1 13-8 24-21 22-1.5-.2-3-.8-4-2z" />
      <path d="M10 30c6-8 12-13 20-18" />
    </svg>
  );
}

export function IconConcrete(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <rect x="7" y="8" width="26" height="24" rx="1" />
      <path d="M13.5 8v24M20 8v24M26.5 8v24" opacity="0.55" />
      <path d="M7 16.5h26M7 24h26" opacity="0.55" />
    </svg>
  );
}

export function IconMembrane(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M6 13c4-3 8-3 12 0s8 3 12 0" />
      <path d="M6 20c4-3 8-3 12 0s8 3 12 0" />
      <path d="M6 27c4-3 8-3 12 0s8 3 12 0" />
    </svg>
  );
}

export function IconInsulation(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <rect x="7" y="7" width="26" height="26" rx="2" />
      {[14, 20, 26].flatMap((cx) =>
        [14, 20, 26].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" stroke="none" />
        ))
      )}
    </svg>
  );
}

export function IconModular(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <rect x="6" y="12" width="28" height="16" rx="1" />
      <path d="M20 12v16" />
      <circle cx="10.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="23.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="16.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="23.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShell(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M6 13h28" />
      <path d="M6 13c0 10.5 6.3 18 14 18s14-7.5 14-18" />
    </svg>
  );
}

export function IconSteel(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M8 10h24l4 6-4 14H8L4 16z" />
      <circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="27.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="20" cy="26" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPhone(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M12 8h5l2 6-3 2.5a16 16 0 0 0 7.5 7.5L26 21l6 2v5a2 2 0 0 1-2.2 2C18.5 29 11 21.5 10 11.2A2 2 0 0 1 12 9z" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <rect x="6" y="10" width="28" height="20" rx="2" />
      <path d="M7 12l13 10 13-10" />
    </svg>
  );
}

export function IconPin(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M20 34s10-10.5 10-18a10 10 0 1 0-20 0c0 7.5 10 18 10 18z" />
      <circle cx="20" cy="16" r="3.4" />
    </svg>
  );
}

export function IconChevron(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M8 5l8 7-8 7" />
    </svg>
  );
}

export function IconPlus(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconArrowUpRight(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
