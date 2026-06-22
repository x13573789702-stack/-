import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3])
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars = {};

  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] =
      `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }

  return vars;
}

const gradientPositions = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%"
];
const gradientKeys = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven"
];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const color = colors[Math.min(colorMap[i], colors.length - 1)];
    vars[gradientKeys[i]] =
      `radial-gradient(at ${gradientPositions[i]}, ${color} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) {
  return 1 - (1 - x) ** 3;
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd
}) {
  const t0 = performance.now() + delay;
  let frameId = null;
  let timeoutId = null;
  let cancelled = false;

  function tick() {
    if (cancelled) return;
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) frameId = requestAnimationFrame(tick);
    else onEnd?.();
  }

  timeoutId = setTimeout(() => {
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
    if (frameId) cancelAnimationFrame(frameId);
  };
}

const BorderGlow = ({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5
}) => {
  const cardRef = useRef(null);
  const pointerFrameRef = useRef(null);
  const pointerPositionRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e) => {
      pointerPositionRef.current = { x: e.clientX, y: e.clientY };
      if (pointerFrameRef.current) return;

      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = null;
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = pointerPositionRef.current.x - rect.left;
        const y = pointerPositionRef.current.y - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
        const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        let angle = dx === 0 && dy === 0 ? 0 : (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;

        card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
        card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
      });
    },
    []
  );

  useEffect(() => () => {
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    const cancelAnimations = [animateValue({
      duration: 500,
      onUpdate: (v) => card.style.setProperty("--edge-proximity", v)
    }), animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (v) => {
        card.style.setProperty(
          "--cursor-angle",
          `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
        );
      }
    }), animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (v) => {
        card.style.setProperty(
          "--cursor-angle",
          `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`
        );
      }
    }), animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (v) => card.style.setProperty("--edge-proximity", v),
      onEnd: () => card.classList.remove("sweep-active")
    })];

    return () => cancelAnimations.forEach((cancel) => cancel());
  }, [animated]);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors)
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};

export default BorderGlow;
