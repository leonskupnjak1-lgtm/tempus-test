import Waterline from "./Waterline";

// The site's water motif, kept very quiet: a slow drifting glow (no rotation,
// just translate/scale drift) and a faint rippling waterline sitting behind
// the foreground content like a reflection on still water. Used on every
// dark, pinned/cinematic section so the ambience reads as one system.
export default function WaterBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-acqua/10 blur-3xl" />
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.14]">
        <Waterline className="text-acqua" opacity={1} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,transparent_0%,rgba(10,24,21,0.65)_100%)]" />
    </div>
  );
}
