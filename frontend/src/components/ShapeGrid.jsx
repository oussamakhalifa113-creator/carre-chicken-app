import { useRef, useEffect } from "react";
import "./ShapeGrid.css";

const ShapeGrid = ({
  direction = "diagonal",
  speed = 0.5,
  borderColor = "#2F293A",
  squareSize = 38,
  hoverFillColor = "#222222",
  shape = "hexagon",
  hoverTrailAmount = 10,
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);
  const trailCells = useRef([]);
  const cellOpacities = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const isHex = shape === "hexagon";
    const hexHoriz = squareSize * 1.5;
    const hexVert = squareSize * Math.sqrt(3);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawHex = (cx, cy, size) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const vx = cx + size * Math.cos(angle);
        const vy = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
    };

    const updateCellOpacities = () => {
      const targets = new Map();

      if (hoveredSquare.current) {
        targets.set(`${hoveredSquare.current.x},${hoveredSquare.current.y}`, 1);
      }

      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.current.length; i++) {
          const cell = trailCells.current[i];
          const key = `${cell.x},${cell.y}`;

          if (!targets.has(key)) {
            targets.set(key, (trailCells.current.length - i) / (trailCells.current.length + 1));
          }
        }
      }

      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) {
          cellOpacities.current.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;

        if (next < 0.005) {
          cellOpacities.current.delete(key);
        } else {
          cellOpacities.current.set(key, next);
        }
      }
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz);
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;

        const cols = Math.ceil(canvas.width / hexHoriz) + 4;
        const rows = Math.ceil(canvas.height / hexVert) + 4;

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX;
            const cy =
              row * hexVert +
              ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) +
              offsetY;

            const key = `${col},${row}`;
            const alpha = cellOpacities.current.get(key);

            if (alpha) {
              ctx.globalAlpha = alpha;
              drawHex(cx, cy, squareSize);
              ctx.fillStyle = hoverFillColor;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            drawHex(cx, cy, squareSize);
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );

      gradient.addColorStop(0, "rgba(7, 17, 31, 0)");
      gradient.addColorStop(1, "rgba(7, 17, 31, 0.82)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      const wrapX = hexHoriz * 2;
      const wrapY = hexVert;

      if (direction === "diagonal") {
        gridOffset.current.x = (gridOffset.current.x - speed + wrapX) % wrapX;
        gridOffset.current.y = (gridOffset.current.y - speed + wrapY) % wrapY;
      }

      updateCellOpacities();
      drawGrid();

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const colShift = Math.floor(gridOffset.current.x / hexHoriz);
      const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz;
      const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert;

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      const col = Math.round(adjustedX / hexHoriz);
      const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0;
      const row = Math.round((adjustedY - rowOffset) / hexVert);

      if (!hoveredSquare.current || hoveredSquare.current.x !== col || hoveredSquare.current.y !== row) {
        if (hoveredSquare.current && hoverTrailAmount > 0) {
          trailCells.current.unshift({ ...hoveredSquare.current });

          if (trailCells.current.length > hoverTrailAmount) {
            trailCells.current.length = hoverTrailAmount;
          }
        }

        hoveredSquare.current = { x: col, y: row };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor, shape, hoverTrailAmount]);

  return <canvas ref={canvasRef} className="shapegrid-canvas" />;
};

export default ShapeGrid;
