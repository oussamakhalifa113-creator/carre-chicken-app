import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./Dock.css";

function DockItem({ icon, label, onClick, mouseX, baseItemSize, magnification, distance }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };

    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );

  const size = useSpring(targetSize, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.button
      ref={ref}
      style={{ width: size, height: size }}
      className="dock-item"
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="dock-label"
            initial={{ opacity: 0, y: 4, x: "-50%" }}
            animate={{ opacity: 1, y: -8, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      <span className="dock-icon">{icon}</span>
    </motion.button>
  );
}

function Dock({ items }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="dock-outer">
      <motion.div
        className="dock-panel"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {items.map((item) => (
          <DockItem
            key={item.label}
            {...item}
            mouseX={mouseX}
            baseItemSize={50}
            magnification={76}
            distance={170}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default Dock;
