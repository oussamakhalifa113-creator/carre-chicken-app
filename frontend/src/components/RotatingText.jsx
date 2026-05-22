import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RotatingText.css";

function RotatingText({ texts, interval = 2200 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span className="rotating-text-wrap">
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          className="rotating-text"
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-120%", opacity: 0, filter: "blur(8px)" }}
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default RotatingText;
