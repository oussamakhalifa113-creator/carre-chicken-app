import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function BlurText({
  text = "",
  delay = 120,
  className = "",
  direction = "top",
}) {
  const words = text.split(" ");
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{
            filter: "blur(12px)",
            opacity: 0,
            y: direction === "top" ? -40 : 40,
          }}
          animate={
            inView
              ? {
                  filter: "blur(0px)",
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            delay: (index * delay) / 1000,
            duration: 0.45,
            ease: "easeOut",
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </h1>
  );
}

export default BlurText;
