import { motion } from "motion/react";
import useInView from "./useInView";

const EASE = [0.16, 1, 0.3, 1];

export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 28,
  duration = 0.9,
  className = "",
  ...props
}) {
  const [ref, inView] = useInView();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </Component>
  );
}
