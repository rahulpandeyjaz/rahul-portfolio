import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Download, ExternalLink, Linkedin, X, ZoomIn, Gamepad2 } from "lucide-react";
import {
  allCertifications,
  certificateProof,
  metricProof,
  profile,
  projects,
  services,
  workExperience,
  type Project,
  type WorkExp
} from "./data";
import "./index.css";

// ─── Utility Components ──────────────────────────────────────────────────────

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
};

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "" }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

type MagnetProps = {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = ""
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const inRange =
        event.clientX >= rect.left - padding &&
        event.clientX <= rect.right + padding &&
        event.clientY >= rect.top - padding &&
        event.clientY <= rect.bottom + padding;

      if (!inRange) {
        setActive(false);
        setTransform("translate3d(0, 0, 0)");
        return;
      }

      setActive(true);
      setTransform(
        `translate3d(${(event.clientX - centerX) / strength}px, ${(event.clientY - centerY) / strength}px, 0)`
      );
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [padding, strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform"
      }}
    >
      {children}
    </div>
  );
}

function ContactButton({ label = "Contact Me", href = `mailto:${profile.email}` }: { label?: string; href?: string }) {
  return (
    <a className="contact-pill" href={href}>
      {label}
    </a>
  );
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"]
  });

  return (
    <p ref={ref} className="animated-text">
      {text.split("").map((character, index) => {
        if (character === " ") {
          return (
            <span key={`space-${index}`} style={{ display: "inline" }}>
              {" "}
            </span>
          );
        }
        return (
          <AnimatedCharacter
            character={character}
            index={index}
            total={text.length}
            progress={scrollYProgress}
            key={`char-${index}`}
          />
        );
      })}
    </p>
  );
}

function AnimatedCharacter({
  character,
  index,
  total,
  progress
}: {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(1, start + 0.12);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="char-wrap">
      <span aria-hidden="true" className="char-placeholder">
        {character}
      </span>
      <motion.span className="char-live" style={{ opacity }}>
        {character}
      </motion.span>
    </span>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.93)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        cursor: "zoom-out"
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close image"
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          background: "rgba(215,226,234,0.12)",
          border: "1px solid rgba(215,226,234,0.25)",
          borderRadius: "50%",
          width: "2.75rem",
          height: "2.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d7e2ea",
          cursor: "pointer",
          transition: "background 200ms ease"
        }}
      >
        <X size={18} />
      </button>

      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          width: "auto",
          height: "auto",
          borderRadius: "1rem",
          boxShadow: "0 40px 100px rgba(0,0,0,0.85)",
          cursor: "default",
          background: "#ffffff"
        }}
      />

      <p
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(215,226,234,0.4)",
          fontSize: "0.72rem",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          pointerEvents: "none"
        }}
      >
        Click anywhere or press Esc to close
      </p>
    </motion.div>
  );
}

// ─── Snake & Ladder Game ───────────────────────────────────────────────────────

const SNAKES: Record<number, number> = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
};
const LADDERS: Record<number, number> = {
  4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
};

function cellToCoord(cell: number): { row: number; col: number } {
  const row = Math.floor((cell - 1) / 10);
  const col = row % 2 === 0 ? (cell - 1) % 10 : 9 - (cell - 1) % 10;
  return { row, col };
}

type GameState = {
  positions: [number, number];
  currentPlayer: 0 | 1;
  dice: number;
  log: string[];
  winner: number | null;
  phase: "idle" | "rolling" | "moving" | "done";
  moveHighlight: number | null;
};

function SnakeLadderGame({ onClose }: { onClose: () => void }) {
  const CELL_SIZE = 44;
  const COLS = 10;

  const initState = (): GameState => ({
    positions: [0, 0],
    currentPlayer: 0,
    dice: 1,
    log: ["Game started! Watching P1 🔴 vs P2 🔵 play automatically."],
    winner: null,
    phase: "idle",
    moveHighlight: null
  });

  const [game, setGame] = useState<GameState>(initState);
  const [autoPlay, setAutoPlay] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rollAndMove = useCallback((state: GameState): GameState => {
    if (state.winner !== null) return state;

    const p = state.currentPlayer;
    const dice = Math.floor(Math.random() * 6) + 1;
    const pName = p === 0 ? "P1 🔴" : "P2 🔵";
    let newPos = state.positions[p] + dice;
    let logEntry = `${pName} rolled ${dice}`;

    if (newPos > 100) {
      logEntry += ` → stays at ${state.positions[p]} (needs exact roll)`;
      return {
        ...state,
        dice,
        log: [logEntry, ...state.log].slice(0, 30),
        currentPlayer: (p === 0 ? 1 : 0) as 0 | 1,
        phase: "idle"
      };
    }

    if (newPos === 100) {
      const positions: [number, number] = [...state.positions] as [number, number];
      positions[p] = 100;
      logEntry += ` → lands on 100 🎉 ${pName} WINS!`;
      return {
        ...state,
        dice,
        positions,
        log: [logEntry, ...state.log].slice(0, 30),
        winner: p,
        phase: "done",
        moveHighlight: 100
      };
    }

    if (SNAKES[newPos]) {
      const from = newPos;
      newPos = SNAKES[newPos];
      logEntry += ` → 🐍 Snake! ${from} → ${newPos}`;
    } else if (LADDERS[newPos]) {
      const from = newPos;
      newPos = LADDERS[newPos];
      logEntry += ` → 🪜 Ladder! ${from} → ${newPos}`;
    } else {
      logEntry += ` → ${newPos}`;
    }

    const positions: [number, number] = [...state.positions] as [number, number];
    positions[p] = newPos;

    return {
      ...state,
      dice,
      positions,
      log: [logEntry, ...state.log].slice(0, 30),
      currentPlayer: (p === 0 ? 1 : 0) as 0 | 1,
      phase: "idle",
      moveHighlight: newPos
    };
  }, []);

  useEffect(() => {
    if (!autoPlay || game.winner !== null) return;
    timerRef.current = setTimeout(() => {
      setGame((prev) => rollAndMove(prev));
    }, 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [autoPlay, game, rollAndMove]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [game.log]);

  const boardCells = Array.from({ length: 100 }, (_, i) => {
    const num = 100 - i;
    const isSnakeHead = num in SNAKES;
    const isLadderBottom = num in LADDERS;
    const isSnakeTail = Object.values(SNAKES).includes(num);
    const isLadderTop = Object.values(LADDERS).includes(num);
    const p1Here = game.positions[0] === num;
    const p2Here = game.positions[1] === num;
    const isHighlight = game.moveHighlight === num;

    const displayRow = Math.floor((num - 1) / 10);
    const displayCol = displayRow % 2 === 0 ? (num - 1) % 10 : 9 - (num - 1) % 10;
    const gridRow = 9 - displayRow;
    const gridCol = displayCol;

    let bg = "#1a1a2e";
    if (isSnakeHead) bg = "#3d0000";
    else if (isLadderBottom) bg = "#003d1a";
    else if (isSnakeTail) bg = "#5a1a1a";
    else if (isLadderTop) bg = "#1a5a2a";
    else if ((gridRow + gridCol) % 2 === 0) bg = "#16213e";

    if (isHighlight) bg = "#4a3500";

    return { num, gridRow, gridCol, isSnakeHead, isLadderBottom, isSnakeTail, isLadderTop, p1Here, p2Here, isHighlight, bg };
  });

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.95)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem", fontFamily: "Kanit, sans-serif"
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0c0c1a",
          border: "1px solid rgba(215,226,234,0.15)",
          borderRadius: "1.5rem",
          padding: "1.5rem",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ color: "#d7e2ea", fontSize: "1.4rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              🎲 Snake & Ladder — Auto Play
            </h2>
            <p style={{ color: "rgba(215,226,234,0.45)", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "0.2rem" }}>
              Watching P1 🔴 vs P2 🔵 battle it out
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={() => setGame(initState())}
              style={{
                background: "rgba(215,226,234,0.1)", border: "1px solid rgba(215,226,234,0.2)",
                color: "#d7e2ea", borderRadius: "0.5rem", padding: "0.4rem 0.8rem",
                fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em",
                fontFamily: "inherit"
              }}
            >
              New Game
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(215,226,234,0.1)", border: "1px solid rgba(215,226,234,0.2)",
                color: "#d7e2ea", borderRadius: "50%", width: "2.2rem", height: "2.2rem",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Score + Dice */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[0, 1].map((p) => (
            <div
              key={p}
              style={{
                flex: 1, minWidth: "120px",
                background: game.currentPlayer === p && !game.winner ? "rgba(182,0,168,0.15)" : "rgba(215,226,234,0.05)",
                border: `1px solid ${game.currentPlayer === p && !game.winner ? "rgba(182,0,168,0.5)" : "rgba(215,226,234,0.1)"}`,
                borderRadius: "0.75rem", padding: "0.75rem 1rem"
              }}
            >
              <div style={{ color: "rgba(215,226,234,0.5)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                {p === 0 ? "P1 🔴" : "P2 🔵"}
              </div>
              <div style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 900, lineHeight: 1 }}>
                {game.positions[p]}
              </div>
              <div style={{ color: "rgba(215,226,234,0.4)", fontSize: "0.65rem", textTransform: "uppercase" }}>
                {game.winner === p ? "🏆 Winner!" : `square`}
              </div>
            </div>
          ))}
          <div style={{
            flex: 1, minWidth: "120px",
            background: "rgba(215,226,234,0.05)",
            border: "1px solid rgba(215,226,234,0.1)",
            borderRadius: "0.75rem", padding: "0.75rem 1rem",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ fontSize: "2.2rem" }}>
              {["⚀","⚁","⚂","⚃","⚄","⚅"][game.dice - 1]}
            </div>
            <div style={{ color: "rgba(215,226,234,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Last roll: {game.dice}
            </div>
          </div>
        </div>

        {/* Winner banner */}
        {game.winner !== null && (
          <div style={{
            background: "linear-gradient(135deg, #7621b0, #b600a8)",
            borderRadius: "0.75rem", padding: "1rem",
            textAlign: "center", color: "#fff", fontWeight: 800,
            fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.12em"
          }}>
            🎉 {game.winner === 0 ? "P1 🔴" : "P2 🔵"} wins the game!
          </div>
        )}

        {/* Board + Log */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* Board */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(10, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(10, ${CELL_SIZE}px)`,
            gap: "2px",
            flex: "0 0 auto",
            position: "relative"
          }}>
            {boardCells.map(({ num, gridRow, gridCol, isSnakeHead, isLadderBottom, p1Here, p2Here, bg }) => (
              <div
                key={num}
                style={{
                  gridRow: gridRow + 1,
                  gridColumn: gridCol + 1,
                  background: bg,
                  borderRadius: "4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  fontSize: "0.55rem",
                  color: "rgba(215,226,234,0.5)",
                  fontWeight: 600,
                  border: isSnakeHead ? "1px solid #ff4444" : isLadderBottom ? "1px solid #44ff88" : "none",
                  transition: "background 0.3s ease"
                }}
              >
                <span style={{ position: "absolute", top: "2px", left: "3px", fontSize: "0.5rem", opacity: 0.6 }}>{num}</span>
                {isSnakeHead && <span style={{ fontSize: "0.85rem" }}>🐍</span>}
                {isLadderBottom && <span style={{ fontSize: "0.85rem" }}>🪜</span>}
                {(p1Here || p2Here) && (
                  <div style={{ display: "flex", gap: "1px", position: "absolute", bottom: "2px" }}>
                    {p1Here && <span style={{ fontSize: "0.75rem" }}>🔴</span>}
                    {p2Here && <span style={{ fontSize: "0.75rem" }}>🔵</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Log */}
          <div style={{ flex: 1, minWidth: "180px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ color: "rgba(215,226,234,0.5)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Game Log
            </div>
            <div
              ref={logRef}
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(215,226,234,0.08)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                height: "360px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem"
              }}
            >
              {game.log.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    color: i === 0 ? "#d7e2ea" : "rgba(215,226,234,0.4)",
                    fontSize: "0.72rem",
                    lineHeight: 1.5,
                    fontWeight: i === 0 ? 500 : 400,
                    borderBottom: "1px solid rgba(215,226,234,0.05)",
                    paddingBottom: "0.3rem"
                  }}
                >
                  {entry}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {[
                { icon: "🐍", label: "Snake head (slide down)", color: "#ff4444" },
                { icon: "🪜", label: "Ladder bottom (climb up)", color: "#44ff88" },
              ].map(({ icon, label, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                  <span style={{ color: color, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col overflow-x-clip">
      <FadeIn delay={0} y={-20}>
        <nav className="flex items-center justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-mist md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]">
          <a className="transition-opacity duration-200 hover:opacity-70" href="#about">
            About
          </a>
          <a className="transition-opacity duration-200 hover:opacity-70" href={profile.cv} download>
            CV
          </a>
          <a className="transition-opacity duration-200 hover:opacity-70" href="#projects">
            Projects
          </a>
          <a className="transition-opacity duration-200 hover:opacity-70" href="#contact">
            Contact
          </a>
        </nav>
      </FadeIn>

      <div className="overflow-hidden px-4">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[13vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[13.8vw] md:-mt-5 md:text-[14.4vw] lg:text-[15.2vw]">
            {profile.heroName}
          </h1>
        </FadeIn>
      </div>

      {/* Avatar — black & white with continuous float animation */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[190px] -translate-x-1/2 -translate-y-1/2 sm:-bottom-8 sm:top-auto sm:w-[240px] sm:translate-y-0 md:-bottom-14 md:w-[295px] lg:-bottom-20 lg:w-[340px]">
        <FadeIn delay={0.6} y={30} className="w-full -rotate-[3deg]">
          <Magnet padding={200} strength={16}>
            <div className="hero-avatar-shell">
              <img
                className="hero-avatar"
                src={profile.avatar}
                alt="Rahul Pandey portrait"
                style={{
                  filter: "grayscale(1) contrast(1.12) brightness(1.06) drop-shadow(0 28px 35px rgba(0,0,0,0.72))"
                }}
              />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between gap-6 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-mist sm:max-w-[220px] md:max-w-[260px]">
            {profile.subtitle}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <div className="flex flex-col items-end gap-3 sm:flex-row">
            <a className="cv-pill" href={profile.cv} download>
              <Download size={18} />
              Download CV
            </a>
            <ContactButton />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ProofTile({ item }: { item: (typeof certificateProof)[number] | (typeof metricProof)[number] }) {
  if ("image" in item && item.image) {
    return (
      <article className="proof-tile image-tile">
        <img src={item.image} alt={`${item.title} certificate`} loading="lazy" />
        <div>
          <span>{item.eyebrow}</span>
          <strong>{item.title}</strong>
        </div>
      </article>
    );
  }

  return (
    <article className="proof-tile metric-tile">
      <span>{item.eyebrow}</span>
      <strong>{item.value}</strong>
      <p>{item.title}</p>
    </article>
  );
}

// ─── Marquee Row — RAF-based with hover pause & wheel/touch scroll ─────────────

function MarqueeRow({
  items,
  direction
}: {
  items: typeof certificateProof | typeof metricProof;
  direction: "left" | "right";
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  // firstSetRef measures exactly one copy's width (tiles + internal gaps + trailing gap)
  // so the loop stride is pixel-perfect and tiles never vanish at the wrap point.
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  // posRef stores current translateX in px.
  // "left": starts at 0, decreases; "right": starts at -320 for visual offset, increases.
  const posRef = useRef(direction === "right" ? -320 : 0);
  const pausedRef = useRef(false);
  const lastTouchXRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const SPEED = 0.85; // px per frame

  // RAF animation loop
  useEffect(() => {
    let raf: number;

    const tick = () => {
      const track = trackRef.current;
      if (track && !pausedRef.current) {
        // Use firstSetRef for an exact stride; fall back to /3 before first paint
        const singleWidth = firstSetRef.current
          ? firstSetRef.current.offsetWidth
          : track.scrollWidth / 3;

        if (direction === "left") {
          posRef.current -= SPEED;
          if (posRef.current <= -singleWidth) posRef.current += singleWidth;
        } else {
          posRef.current += SPEED;
          if (posRef.current >= singleWidth) posRef.current -= singleWidth;
        }

        track.style.transform = `translateX(${posRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction]);

  // Wheel scroll when paused — passive: false so we can preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (!pausedRef.current || !trackRef.current) return;
      e.preventDefault();
      const track = trackRef.current;
      const singleWidth = firstSetRef.current
        ? firstSetRef.current.offsetWidth
        : track.scrollWidth / 3;
      // Horizontal wheel takes priority, fallback to vertical
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      posRef.current -= delta * 0.55;
      // Normalise within one segment to keep seamless looping
      if (posRef.current < -singleWidth) posRef.current += singleWidth;
      if (posRef.current > singleWidth) posRef.current -= singleWidth;
      track.style.transform = `translateX(${posRef.current}px)`;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  // Touch drag support (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    pausedRef.current = true;
    setIsPaused(true);
    lastTouchXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const dx = e.touches[0].clientX - lastTouchXRef.current;
    lastTouchXRef.current = e.touches[0].clientX;
    const singleWidth = firstSetRef.current
      ? firstSetRef.current.offsetWidth
      : trackRef.current.scrollWidth / 3;
    posRef.current += dx;
    if (posRef.current < -singleWidth) posRef.current += singleWidth;
    if (posRef.current > singleWidth) posRef.current -= singleWidth;
    trackRef.current.style.transform = `translateX(${posRef.current}px)`;
  };

  const handleTouchEnd = () => {
    pausedRef.current = false;
    setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        cursor: isPaused ? "grab" : "default",
        // Subtle highlight ring when paused so user knows they're in control
        outline: isPaused ? "1px solid rgba(182,0,168,0.35)" : "1px solid transparent",
        borderRadius: "0.5rem",
        transition: "outline 200ms ease"
      }}
      onMouseEnter={() => { pausedRef.current = true; setIsPaused(true); }}
      onMouseLeave={() => { pausedRef.current = false; setIsPaused(false); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pause indicator */}
      {isPaused && (
        <div
          style={{
            position: "absolute",
            top: "0.4rem",
            right: "0.75rem",
            zIndex: 10,
            color: "rgba(215,226,234,0.45)",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            pointerEvents: "none",
            userSelect: "none"
          }}
        >
          ● Scroll to browse
        </div>
      )}
      <div
        ref={trackRef}
        className="marquee-row"
        style={{ willChange: "transform" }}
      >
        {/* Three wrapped sets — firstSetRef measures one set's exact pixel stride */}
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? firstSetRef : undefined}
            style={{
              display: "flex",
              gap: "0.75rem",
              paddingRight: "0.75rem", // trailing gap ensures seamless join between sets
              flexShrink: 0
            }}
          >
            {items.map((item, index) => (
              <ProofTile item={item} key={`${item.title}-${index}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MarqueeSection() {
  return (
    <section className="overflow-hidden bg-ink pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex flex-col gap-3" style={{ position: "relative" }}>
        <MarqueeRow items={certificateProof} direction="right" />
        <MarqueeRow items={metricProof} direction="left" />
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-5">
        <p className="mb-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.2em] text-mist/40">
          All Certifications
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {allCertifications.map((cert) => (
            <span
              key={cert.name}
              className="rounded-full border border-mist/20 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-widest text-mist/55"
            >
              {cert.name} · {cert.issuer}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 py-20 sm:px-8 md:px-10"
    >
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="decor decor-moon">
        <div className="decor-orb decor-blue">CTR</div>
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="decor decor-cube">
        <div className="decor-cube-shape">CVR</div>
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="decor decor-smile">
        <div className="decor-ring">ROAS</div>
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="decor decor-cursor">
        <div className="decor-arrow">CAC</div>
      </FadeIn>

      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-10 text-center sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
            About Me
          </h2>
        </FadeIn>
        <AnimatedText text={profile.about} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <ContactButton />
          <a className="cv-pill" href={profile.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function WorkExperienceSection() {
  const innerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const yRef = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const inner = innerRef.current;
      if (inner && !pausedRef.current) {
        yRef.current += 0.65;
        const halfH = inner.scrollHeight / 2;
        if (yRef.current >= halfH) yRef.current -= halfH;
        if (yRef.current < 0) yRef.current = 0;
        inner.style.transform = `translateY(-${yRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (e: WheelEvent) => {
      if (!pausedRef.current) return;
      e.preventDefault();
      const inner = innerRef.current;
      if (!inner) return;
      const halfH = inner.scrollHeight / 2;
      yRef.current = Math.max(0, Math.min(yRef.current + e.deltaY * 0.6, halfH - 1));
      inner.style.transform = `translateY(-${yRef.current}px)`;
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, []);

  const doubled = [...workExperience, ...workExperience];

  return (
    <section
      id="experience"
      className="bg-ink px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <FadeIn>
        <h2 className="hero-heading mb-16 text-center text-[clamp(2.5rem,10vw,120px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">
          Experience
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-5xl">
        <div
          ref={viewportRef}
          style={{ maxHeight: "560px", overflow: "hidden", position: "relative", cursor: "ns-resize" }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "60px",
            background: "linear-gradient(to bottom, #0c0c0c, transparent)",
            pointerEvents: "none", zIndex: 2
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
            background: "linear-gradient(to top, #0c0c0c, transparent)",
            pointerEvents: "none", zIndex: 2
          }} />

          <div ref={innerRef}>
            {doubled.map((job: WorkExp, index: number) => (
              <article
                key={`${job.company}-${index}`}
                className="border-t border-mist/10 py-8 sm:py-10 md:py-12"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <div className="flex-1">
                    <h3 className="text-[clamp(1rem,2vw,1.55rem)] font-semibold uppercase leading-snug text-mist">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-[clamp(0.85rem,1.4vw,1.1rem)] font-medium text-mist/60">
                      {job.company} &middot; {job.location}
                    </p>
                  </div>
                  <span className="mt-1 whitespace-nowrap text-[0.78rem] font-medium uppercase tracking-widest text-mist/40 sm:mt-0">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {job.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[clamp(0.82rem,1.35vw,1.05rem)] font-light leading-relaxed text-mist/55"
                    >
                      <span className="mt-[3px] shrink-0 text-mist/30">—</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <div className="border-t border-mist/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Cartoon Characters for Skills Sidebar ───────────────────────────────────
// Place transparent-background PNGs at public/assets/chars/
// Recommended sources: PNGWing, PNGImg, or export with alpha from Illustrator.
// blend: "multiply" = works on white-bg PNGs (removes white); "screen" = works on black-bg PNGs (removes black)
const FLOATING_CHARS_DATA = [
  {
    image: "/assets/chars/peter-griffin.png",
    label: "ROAS Hunter",
    stat: "6.4× ROAS",
    blend: "multiply" as React.CSSProperties["mixBlendMode"]
  },
  {
    image: "/assets/chars/bojack-horseman.png",
    label: "Data Driven",
    stat: "Clean Attribution",
    blend: "multiply" as React.CSSProperties["mixBlendMode"]
  },
  {
    image: "/assets/chars/doraemon.png",
    label: "Growth Mode",
    stat: "+97% Revenue",
    blend: "multiply" as React.CSSProperties["mixBlendMode"]
  },
  {
    image: "/assets/chars/shinchan.png",
    label: "On Target",
    stat: "15.62% ACOS",
    blend: "screen" as React.CSSProperties["mixBlendMode"]
  },
  {
    image: "/assets/chars/tom-cat.png",
    label: "Optimizer",
    stat: "1,019+ Campaigns",
    blend: "multiply" as React.CSSProperties["mixBlendMode"]
  },
  {
    image: "/assets/chars/bart-simpson-phone.png",
    label: "Generative AI",
    stat: "Claude & OpenCode",
    blend: "screen" as React.CSSProperties["mixBlendMode"]
  }
];

type FloatingCharDatum = typeof FLOATING_CHARS_DATA[number];

function FloatingChar({
  charData,
  floatDelay,
  entryDelay,
  idx
}: {
  charData: FloatingCharDatum;
  floatDelay: number;
  entryDelay: number;
  idx: number;
}) {
  return (
    // Outer: continuous gentle float
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{
        duration: 3.4 + idx * 0.42,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay
      }}
    >
      {/* Inner: entry + hover */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { delay: entryDelay, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
        }}
        whileHover={{
          scale: 1.1,
          rotate: idx % 2 === 0 ? 4 : -4,
          transition: { duration: 0.22, ease: "easeOut" }
        }}
        viewport={{ once: true }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.3rem",
          cursor: "default",
          userSelect: "none",
          willChange: "transform"
        }}
      >
        {/* Cartoon character image */}
        <img
          src={charData.image}
          alt={charData.label}
          loading="lazy"
          style={{
            width: "clamp(72px, 7.5vw, 112px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.22)) drop-shadow(0 2px 4px rgba(0,0,0,0.14))"
          }}
        />

        {/* Label pill */}
        <span
          style={{
            color: "#0c0c0c",
            fontSize: "0.56rem",
            fontWeight: 700,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            lineHeight: 1,
            fontFamily: "Kanit, sans-serif",
            background: "rgba(12,12,12,0.07)",
            borderRadius: "999px",
            padding: "0.2rem 0.55rem"
          }}
        >
          {charData.label}
        </span>

        {/* Stat */}
        <span
          style={{
            color: "rgba(12,12,12,0.45)",
            fontSize: "0.5rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            fontFamily: "Kanit, sans-serif"
          }}
        >
          {charData.stat}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section
      id="skills"
      className="rounded-t-[40px] bg-white px-5 py-20 text-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <FadeIn>
        <h2 className="mb-16 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28">
          Skills
        </h2>
      </FadeIn>

      {/* Characters inline with each service row — feet sit on the dividing line */}
      <div className="mx-auto max-w-7xl">
        {services.map((service, index) => {
          const char = FLOATING_CHARS_DATA[index];
          return (
            <FadeIn delay={index * 0.1} key={service.number}>
              <article
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(100px, 0.22fr) 1fr auto",
                  gap: "clamp(1.25rem, 4vw, 4rem)",
                  alignItems: "end",
                  borderTop: "1px solid rgba(12,12,12,0.15)",
                  paddingTop: "clamp(2rem, 5vw, 3rem)",
                  paddingBottom: "0"
                }}
              >
                <span className="service-number">{service.number}</span>
                <div className="space-y-3" style={{ paddingBottom: "clamp(2rem, 5vw, 3rem)" }}>
                  <h3 style={{ fontSize: "clamp(1rem,2.2vw,2.1rem)", fontWeight: 500, textTransform: "uppercase" }}>{service.name}</h3>
                  <p style={{ maxWidth: "42rem", fontSize: "clamp(0.85rem,1.6vw,1.25rem)", fontWeight: 300, lineHeight: 1.7, opacity: 0.6 }}>{service.description}</p>
                </div>
                {char && (
                  <div className="hidden lg:block" style={{ flexShrink: 0, alignSelf: "end" }}>
                    <FloatingChar charData={char} floatDelay={index * 0.35} entryDelay={index * 0.09} idx={index} />
                  </div>
                )}
              </article>
            </FadeIn>
          );
        })}
        <div style={{ borderTop: "1px solid rgba(12,12,12,0.15)" }} />
      </div>

    </section>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  progress,
  total,
  onImageClick
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  total: number;
  onImageClick: (src: string, alt: string) => void;
}) {
  const scaleStart = index / total;
  const scaleEnd = (index + 1) / total;
  const targetScale = 1 - (total - 1 - index) * 0.025;
  const scale = useTransform(progress, [scaleStart, scaleEnd], [1, targetScale]);

  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className="project-card"
      style={{
        scale,
        top: `calc(6rem + ${index * 28}px)`
      }}
    >
      <div className="project-top">
        <span className="project-number">{project.number}</span>
        <div className="project-title-block">
          <span>{project.category}</span>
          <h3>{project.name}</h3>
          <p>{project.summary}</p>
          <div className="project-metrics">
            {project.metrics.map((metric) => (
              <strong key={metric}>{metric}</strong>
            ))}
          </div>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${project.name} dashboard full size`}
        onClick={() => onImageClick(project.image, `${project.name} campaign dashboard`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onImageClick(project.image, `${project.name} campaign dashboard`);
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          marginTop: "clamp(2rem,5vw,4rem)",
          cursor: "zoom-in",
          borderRadius: "clamp(20px,2.4vw,34px)",
          overflow: "hidden",
          border: "1px solid rgba(215,226,234,0.32)",
          boxShadow: hovered
            ? "0 34px 90px rgba(0,0,0,0.55)"
            : "0 26px 70px rgba(0,0,0,0.38)",
          transition: "box-shadow 260ms ease",
          background: "#ffffff"
        }}
      >
        <img
          src={project.image}
          alt={`${project.name} campaign dashboard`}
          loading="lazy"
          style={{
            width: "100%",
            display: "block",
            maxHeight: "clamp(260px,36vw,540px)",
            objectFit: "cover",
            objectPosition: "top",
            transform: hovered ? "scale(1.015)" : "scale(1)",
            transition: "transform 320ms ease"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.38)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 260ms ease",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(215,226,234,0.15)",
              border: "1px solid rgba(215,226,234,0.35)",
              borderRadius: "9999px",
              padding: "0.55rem 1.25rem",
              color: "#d7e2ea",
              fontSize: "0.78rem",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase"
            }}
          >
            <ZoomIn size={15} />
            View full size
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      <section
        id="projects"
        ref={ref}
        className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-5 py-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
      >
        <FadeIn>
          <div className="mb-24 text-center">
            <h2 className="hero-heading text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight">
              My Work
            </h2>
            <p className="mt-3 text-[clamp(0.85rem,1.8vw,1.4rem)] font-light uppercase tracking-[0.3em] text-mist/40">
              ( A Glimpse )
            </p>
          </div>
        </FadeIn>
        <div className="mx-auto max-w-7xl">
          {projects.map((project, index) => (
            <div className="h-[85vh]" key={project.number}>
              <ProjectCard
                project={project}
                index={index}
                total={projects.length}
                progress={scrollYProgress}
                onImageClick={(src, alt) => setLightbox({ src, alt })}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  const [showGame, setShowGame] = useState(false);

  return (
    <>
      {showGame && <SnakeLadderGame onClose={() => setShowGame(false)} />}

      <section
        id="contact"
        className="relative z-30 bg-ink px-5 py-24 text-center sm:px-8 md:px-10"
        style={{ isolation: "isolate" }}
      >
        <FadeIn>
          <h2 className="hero-heading mx-auto max-w-6xl text-[clamp(3rem,12vw,150px)] font-black uppercase leading-none tracking-tight">
            Contact
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-lg font-light uppercase tracking-wide text-mist/80">
            Available for performance marketing roles, campaign operations, paid media execution, and growth consulting.
          </p>
        </FadeIn>
        <FadeIn delay={0.25}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <ContactButton label="Email Me" />
            <a className="cv-pill" href={profile.cv} download>
              <Download size={18} />
              CV Download
            </a>
            <a className="cv-pill" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={18} />
              LinkedIn
            </a>
            <button
              onClick={() => setShowGame(true)}
              className="cv-pill"
              style={{
                background: "linear-gradient(135deg, rgba(118,33,176,0.25), rgba(182,0,168,0.25))",
                border: "2px solid rgba(182,0,168,0.6)",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              <Gamepad2 size={18} />
              Play a Game
            </button>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  return (
    <main className="min-h-screen overflow-x-clip bg-ink font-kanit">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <WorkExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
