// Every photograph on this site is treated as a plate on an architect's
// material board. When a real photo exists at `src`, it fills the plate.
// Until then (missing file, or a 404 while the client is still shooting),
// the plate renders its own frame — corner ticks and a mono caption naming
// exactly what belongs there — so the page never looks unfinished, only
// in-progress. Point `src` at the path documented in public/images/MANIFEST.md
// and the real photo takes over automatically.

import { useState } from "react";

export default function ImagePlate({
  src,
  alt = "",
  caption,
  ratio = "aspect-[4/5]",
  className = "",
  priority = false,
  dark = true,
  imgRef,
  hoverZoom = true,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`group relative overflow-hidden ${ratio} ${className}`}>
      {src && !failed ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${
            hoverZoom ? "transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]" : ""
          }`}
        />
      ) : (
        <div
          className={`grain absolute inset-0 flex flex-col justify-between p-5 ${
            dark
              ? "bg-[linear-gradient(155deg,var(--color-notte-soft),var(--color-notte)_55%,var(--color-cemento)_190%)]"
              : "bg-[linear-gradient(155deg,var(--color-travertino-soft),var(--color-sabbia)_75%)]"
          }`}
        >
          <div className={`flex justify-between font-mono text-[10px] ${dark ? "text-travertino/35" : "text-ink/25"}`}>
            <span>+</span>
            <span>+</span>
          </div>
          {caption && (
            <p
              className={`max-w-[80%] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] ${
                dark ? "text-travertino/55" : "text-ink/45"
              }`}
            >
              {caption}
            </p>
          )}
          <div className={`flex justify-between font-mono text-[10px] ${dark ? "text-travertino/35" : "text-ink/25"}`}>
            <span>+</span>
            <span>+</span>
          </div>
        </div>
      )}
    </figure>
  );
}
