// Decides once, synchronously, which hero mounts — never both. A phone in
// landscape still gets the desktop scrub (it already picks the mobile frame
// budget on its own via matchMedia), only narrow + portrait gets the
// play-once video hero. Resolved eagerly (not in an effect) so the loser of
// the two never mounts and never fires its data-fetching effects — an effect
// on the wrapper would still let the child that loses the race run its
// mount-time fetch once before being torn down.
import { useState } from "react";
import Hero from "./Hero";
import MobileHero from "./MobileHero";

function resolveMobilePortrait() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches && window.matchMedia("(orientation: portrait)").matches;
}

export default function HeroSwitch() {
  const [mobilePortrait] = useState(resolveMobilePortrait);
  return mobilePortrait ? <MobileHero /> : <Hero />;
}
