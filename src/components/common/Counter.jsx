import { useEffect, useState } from "react";
import useInView from "./useInView";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function Counter({ to, suffix = "", duration = 1.8, className = "" }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / 1000 / duration, 1);
      setValue(Math.round(easeOutCubic(t) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
