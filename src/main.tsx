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

// ─── Chess Game — Human (White) vs AI (Black, Intermediate) ─────────────────

type ChessColor = 'w' | 'b';
type ChessPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type ChessPiece = { type: ChessPieceType; color: ChessColor };
type ChessSquare = ChessPiece | null;
type ChessBoard = ChessSquare[][];
type ChessMove = {
  from: [number, number];
  to: [number, number];
  promotion?: ChessPieceType;
  enPassant?: boolean;
  castling?: boolean;
};

const PIECE_VALUES: Record<ChessPieceType, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
};

const PAWN_TABLE = [
  [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],
  [5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],
  [5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
];
const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],
  [-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],
  [-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],
  [-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
];
const BISHOP_TABLE = [
  [-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
  [-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],
  [-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],
  [-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
];
const ROOK_TABLE = [
  [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],
  [-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
];
const QUEEN_TABLE = [
  [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],
  [-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],
  [0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],
  [-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
];
const KING_TABLE = [
  [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],
  [20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
];

function getPosValue(piece: ChessPiece, row: number, col: number): number {
  const r = piece.color === 'w' ? row : 7 - row;
  switch (piece.type) {
    case 'p': return PAWN_TABLE[r][col];
    case 'n': return KNIGHT_TABLE[r][col];
    case 'b': return BISHOP_TABLE[r][col];
    case 'r': return ROOK_TABLE[r][col];
    case 'q': return QUEEN_TABLE[r][col];
    case 'k': return KING_TABLE[r][col];
  }
}

function cloneBoard(board: ChessBoard): ChessBoard {
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
}

function findKing(board: ChessBoard, color: ChessColor): [number, number] | null {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) return [r, c];
    }
  return null;
}

function getRawMoves(board: ChessBoard, row: number, col: number, ep: [number, number] | null): ChessMove[] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: ChessMove[] = [];
  const { type, color } = piece;
  const opp: ChessColor = color === 'w' ? 'b' : 'w';

  const slide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < 8 && c >= 0 && c < 8) {
      if (board[r][c]) { if (board[r][c]!.color === opp) moves.push({ from: [row, col], to: [r, c] }); break; }
      moves.push({ from: [row, col], to: [r, c] });
      r += dr; c += dc;
    }
  };

  if (type === 'p') {
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    const promRow = color === 'w' ? 0 : 7;
    const nr = row + dir;
    if (nr >= 0 && nr < 8 && !board[nr][col]) {
      if (nr === promRow) {
        (['q','r','b','n'] as ChessPieceType[]).forEach(pt => moves.push({ from: [row, col], to: [nr, col], promotion: pt }));
      } else {
        moves.push({ from: [row, col], to: [nr, col] });
        if (row === startRow && !board[nr + dir]?.[col]) moves.push({ from: [row, col], to: [nr + dir, col] });
      }
    }
    for (const dc of [-1, 1]) {
      const nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (board[nr][nc]?.color === opp) {
          if (nr === promRow) (['q','r','b','n'] as ChessPieceType[]).forEach(pt => moves.push({ from: [row, col], to: [nr, nc], promotion: pt }));
          else moves.push({ from: [row, col], to: [nr, nc] });
        }
        if (ep && nr === ep[0] && nc === ep[1]) moves.push({ from: [row, col], to: [nr, nc], enPassant: true });
      }
    }
  } else if (type === 'n') {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc]?.color !== color)
        moves.push({ from: [row, col], to: [nr, nc] });
    }
  } else if (type === 'b') {
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) slide(dr, dc);
  } else if (type === 'r') {
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
  } else if (type === 'q') {
    for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]) slide(dr, dc);
  } else if (type === 'k') {
    for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc]?.color !== color)
        moves.push({ from: [row, col], to: [nr, nc] });
    }
  }
  return moves;
}

function isUnderAttack(board: ChessBoard, row: number, col: number, byColor: ChessColor): boolean {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== byColor) continue;
      if (getRawMoves(board, r, c, null).some(m => m.to[0] === row && m.to[1] === col)) return true;
    }
  return false;
}

function isInCheck(board: ChessBoard, color: ChessColor): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  return isUnderAttack(board, king[0], king[1], color === 'w' ? 'b' : 'w');
}

function applyMove(board: ChessBoard, move: ChessMove): ChessBoard {
  const nb = cloneBoard(board);
  const piece = nb[move.from[0]][move.from[1]]!;
  nb[move.to[0]][move.to[1]] = move.promotion ? { type: move.promotion, color: piece.color } : piece;
  nb[move.from[0]][move.from[1]] = null;
  if (move.enPassant) nb[move.from[0]][move.to[1]] = null;
  if (move.castling) {
    const row = move.from[0];
    if (move.to[1] === 6) { nb[row][5] = nb[row][7]; nb[row][7] = null; }
    else { nb[row][3] = nb[row][0]; nb[row][0] = null; }
  }
  return nb;
}

type CastlingRights = { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };

function getLegalMoves(board: ChessBoard, row: number, col: number, ep: [number, number] | null, cr: CastlingRights): ChessMove[] {
  const piece = board[row][col];
  if (!piece) return [];
  let raw = getRawMoves(board, row, col, ep);

  if (piece.type === 'k') {
    const color = piece.color;
    const baseRow = color === 'w' ? 7 : 0;
    const opp: ChessColor = color === 'w' ? 'b' : 'w';
    if (row === baseRow && col === 4 && !isInCheck(board, color)) {
      if ((color === 'w' ? cr.wK : cr.bK) && !board[baseRow][5] && !board[baseRow][6] &&
          board[baseRow][7]?.type === 'r' &&
          !isUnderAttack(board, baseRow, 5, opp) && !isUnderAttack(board, baseRow, 6, opp))
        raw.push({ from: [row, col], to: [baseRow, 6], castling: true });
      if ((color === 'w' ? cr.wQ : cr.bQ) && !board[baseRow][3] && !board[baseRow][2] && !board[baseRow][1] &&
          board[baseRow][0]?.type === 'r' &&
          !isUnderAttack(board, baseRow, 3, opp) && !isUnderAttack(board, baseRow, 2, opp))
        raw.push({ from: [row, col], to: [baseRow, 2], castling: true });
    }
  }
  return raw.filter(m => !isInCheck(applyMove(board, m), piece.color));
}

function getAllLegalMoves(board: ChessBoard, color: ChessColor, ep: [number, number] | null, cr: CastlingRights): ChessMove[] {
  const moves: ChessMove[] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c]?.color === color) moves.push(...getLegalMoves(board, r, c, ep, cr));
  return moves;
}

function evaluate(board: ChessBoard): number {
  let score = 0;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const val = PIECE_VALUES[p.type] + getPosValue(p, r, c);
      score += p.color === 'w' ? val : -val;
    }
  return score;
}

function minimax(board: ChessBoard, depth: number, alpha: number, beta: number, isMax: boolean, ep: [number, number] | null, cr: CastlingRights): number {
  if (depth === 0) return evaluate(board);
  const color: ChessColor = isMax ? 'w' : 'b';
  const moves = getAllLegalMoves(board, color, ep, cr);
  if (moves.length === 0) return isInCheck(board, color) ? (isMax ? -50000 : 50000) : 0;
  if (isMax) {
    let best = -Infinity;
    for (const m of moves) { best = Math.max(best, minimax(applyMove(board, m), depth - 1, alpha, beta, false, null, cr)); alpha = Math.max(alpha, best); if (beta <= alpha) break; }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) { best = Math.min(best, minimax(applyMove(board, m), depth - 1, alpha, beta, true, null, cr)); beta = Math.min(beta, best); if (beta <= alpha) break; }
    return best;
  }
}

function getBestAIMove(board: ChessBoard, ep: [number, number] | null, cr: CastlingRights): ChessMove | null {
  const moves = getAllLegalMoves(board, 'b', ep, cr);
  if (!moves.length) return null;
  let best: ChessMove | null = null, bestVal = Infinity;
  for (const m of moves) {
    const val = minimax(applyMove(board, m), 2, -Infinity, Infinity, true, null, cr);
    if (val < bestVal) { bestVal = val; best = m; }
  }
  return best;
}

function initChessBoard(): ChessBoard {
  const b: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  const back: ChessPieceType[] = ['r','n','b','q','k','b','n','r'];
  for (let c = 0; c < 8; c++) {
    b[0][c] = { type: back[c], color: 'b' };
    b[1][c] = { type: 'p', color: 'b' };
    b[6][c] = { type: 'p', color: 'w' };
    b[7][c] = { type: back[c], color: 'w' };
  }
  return b;
}

const GLYPHS: Record<ChessColor, Record<ChessPieceType, string>> = {
  w: { k:'♔', q:'♕', r:'♖', b:'♗', n:'♘', p:'♙' },
  b: { k:'♚', q:'♛', r:'♜', b:'♝', n:'♞', p:'♟' }
};

const FILES = ['a','b','c','d','e','f','g','h'];
const toAN = (r: number, c: number) => `${FILES[c]}${8 - r}`;

function ChessGame({ onClose }: { onClose: () => void }) {
  // null = color picker screen not yet dismissed
  const [playerColor, setPlayerColor] = useState<ChessColor | null>(null);
  const [board, setBoard] = useState<ChessBoard>(initChessBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<ChessMove[]>([]);
  const [turn, setTurn] = useState<ChessColor>('w');
  const [status, setStatus] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [ep, setEp] = useState<[number, number] | null>(null);
  const [cr, setCr] = useState<CastlingRights>({ wK: true, wQ: true, bK: true, bQ: true });
  const [gameOver, setGameOver] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = 0; }, [log]);

  // When AI plays white, it moves immediately after color is chosen
  const doAIMove = useCallback((b: ChessBoard, currentCr: CastlingRights, aiColor: ChessColor, humanColor: ChessColor) => {
    setAiThinking(true);
    setStatus('Thinking...');
    setTimeout(() => {
      const move = getBestAIMove(b, null, currentCr);
      if (!move) {
        const msg = isInCheck(b, aiColor) ? `Checkmate! You win! 🎉` : 'Stalemate — draw!';
        setStatus(msg); setLog(p => [msg, ...p]); setGameOver(true); setAiThinking(false); return;
      }
      const piece = b[move.from[0]][move.from[1]]!;
      const cap = b[move.to[0]][move.to[1]];
      const aiGlyph = GLYPHS[aiColor];
      const humanGlyph = GLYPHS[humanColor];
      let desc = `AI: ${aiGlyph[piece.type]} ${toAN(move.from[0],move.from[1])} → ${toAN(move.to[0],move.to[1])}`;
      if (cap) desc += ` ×${humanGlyph[cap.type]}`;
      if (move.castling) desc += ' (castle)';
      const nb = applyMove(b, move);
      const newCr = { ...currentCr };
      if (piece.type === 'k' && piece.color === aiColor) {
        if (aiColor==='b') { newCr.bK=false; newCr.bQ=false; } else { newCr.wK=false; newCr.wQ=false; }
      }
      if (piece.type === 'r' && piece.color === aiColor) {
        if (aiColor==='b') { if (move.from[1]===0) newCr.bQ=false; if (move.from[1]===7) newCr.bK=false; }
        else { if (move.from[1]===0) newCr.wQ=false; if (move.from[1]===7) newCr.wK=false; }
      }
      const newEp: [number,number] | null = (piece.type==='p' && Math.abs(move.to[0]-move.from[0])===2)
        ? [(move.from[0]+move.to[0])/2, move.to[1]] : null;
      setBoard(nb); setCr(newCr); setEp(newEp);
      const humanMoves = getAllLegalMoves(nb, humanColor, newEp, newCr);
      if (humanMoves.length === 0) {
        const msg = isInCheck(nb, humanColor) ? 'Checkmate! AI wins 🤖' : 'Stalemate — draw!';
        desc += ` — ${msg}`; setStatus(msg); setGameOver(true);
      } else if (isInCheck(nb, humanColor)) { desc += ' ⚠️ Check!'; setStatus('Check! ⚠️'); }
      else setStatus('Your turn');
      setLog(p => [desc, ...p].slice(0,40)); setTurn(humanColor); setAiThinking(false);
    }, 350);
  }, []);

  const startGame = (color: ChessColor) => {
    const aiColor: ChessColor = color === 'w' ? 'b' : 'w';
    setPlayerColor(color);
    setBoard(initChessBoard()); setSelected(null); setLegalMoves([]);
    setTurn('w');
    setEp(null); setCr({ wK:true, wQ:true, bK:true, bQ:true });
    setGameOver(false); setAiThinking(false);
    const kingGlyph = color === 'w' ? '♔' : '♚';
    setLog([`Game on. You play ${color === 'w' ? 'White' : 'Black'} ${kingGlyph}`]);
    if (color === 'w') {
      setStatus('Your turn');
    } else {
      // AI plays white, moves first
      setStatus('Thinking...');
      setTimeout(() => doAIMove(initChessBoard(), { wK:true, wQ:true, bK:true, bQ:true }, aiColor, color), 400);
    }
  };

  const reset = () => { setPlayerColor(null); setGameOver(false); setAiThinking(false); };

  const handleClick = (row: number, col: number) => {
    if (!playerColor) return;
    const humanColor = playerColor;
    const aiColor: ChessColor = humanColor === 'w' ? 'b' : 'w';
    if (turn !== humanColor || gameOver || aiThinking) return;
    const piece = board[row][col];
    if (selected) {
      const move = legalMoves.find(m => m.to[0]===row && m.to[1]===col && (!m.promotion || m.promotion==='q'));
      if (move) {
        const final = move.promotion ? { ...move, promotion: 'q' as ChessPieceType } : move;
        const mp = board[selected[0]][selected[1]]!;
        const cap = board[row][col];
        const humanGlyph = GLYPHS[humanColor];
        const aiGlyph = GLYPHS[aiColor];
        let desc = `You: ${humanGlyph[mp.type]} ${toAN(selected[0],selected[1])} → ${toAN(row,col)}`;
        if (cap) desc += ` ×${aiGlyph[cap.type]}`;
        if (final.promotion) desc += ' =♕';
        if (final.castling) desc += ' (castle)';
        const nb = applyMove(board, final);
        const newCr = { ...cr };
        if (mp.type==='k') { if (humanColor==='w') { newCr.wK=false; newCr.wQ=false; } else { newCr.bK=false; newCr.bQ=false; } }
        if (mp.type==='r') {
          if (humanColor==='w') { if (selected[1]===0) newCr.wQ=false; if (selected[1]===7) newCr.wK=false; }
          else { if (selected[1]===0) newCr.bQ=false; if (selected[1]===7) newCr.bK=false; }
        }
        const newEp: [number,number] | null = (mp.type==='p' && Math.abs(row-selected[0])===2)
          ? [(selected[0]+row)/2, col] : null;
        setBoard(nb); setCr(newCr); setEp(newEp); setSelected(null); setLegalMoves([]);
        const aiMoves = getAllLegalMoves(nb, aiColor, newEp, newCr);
        if (aiMoves.length === 0) {
          const msg = isInCheck(nb, aiColor) ? 'Checkmate! You win! 🎉' : 'Stalemate — draw!';
          desc += ` — ${msg}`; setLog(p => [desc,...p].slice(0,40)); setStatus(msg); setGameOver(true); return;
        }
        if (isInCheck(nb, aiColor)) desc += ' ⚠️ Check!';
        setLog(p => [desc,...p].slice(0,40)); setTurn(aiColor);
        doAIMove(nb, newCr, aiColor, humanColor); return;
      }
      if (piece?.color === humanColor) {
        setSelected([row,col]); setLegalMoves(getLegalMoves(board,row,col,ep,cr)); return;
      }
      setSelected(null); setLegalMoves([]); return;
    }
    if (piece?.color === humanColor) { setSelected([row,col]); setLegalMoves(getLegalMoves(board,row,col,ep,cr)); }
  };

  const humanColor = playerColor ?? 'w';
  const kingPos = findKing(board, humanColor);
  const kingInCheck = playerColor && !gameOver && kingPos && isInCheck(board, humanColor);
  const SQ = 52;

  // ── Color picker screen ──
  if (!playerColor) {
    return (
      <div
        style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.95)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"1rem", fontFamily:"Kanit, sans-serif" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale:0.88, opacity:0, y:28 }}
          animate={{ scale:1, opacity:1, y:0 }}
          transition={{ duration:0.35, ease:[0.25,0.1,0.25,1] }}
          onClick={e => e.stopPropagation()}
          style={{ background:"#0c0c1a", border:"1px solid rgba(215,226,234,0.15)",
            borderRadius:"1.5rem", padding:"2.5rem 2rem", maxWidth:"400px", width:"100%",
            textAlign:"center", position:"relative" }}
        >
          <button onClick={onClose} style={{ position:"absolute", top:"1rem", right:"1rem",
            background:"rgba(215,226,234,0.08)", border:"1px solid rgba(215,226,234,0.15)",
            borderRadius:"50%", width:"2rem", height:"2rem", display:"flex", alignItems:"center",
            justifyContent:"center", color:"#d7e2ea", cursor:"pointer" }}>
            <X size={14} />
          </button>

          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>♟</div>
          <h2 style={{ color:"#d7e2ea", fontSize:"1.5rem", fontWeight:900, textTransform:"uppercase",
            letterSpacing:"0.08em", marginBottom:"0.5rem" }}>
            Let's See Who Wins
          </h2>
          <p style={{ color:"rgba(215,226,234,0.45)", fontSize:"0.78rem", letterSpacing:"0.12em",
            textTransform:"uppercase", marginBottom:"2rem" }}>
            Pick your side
          </p>

          <div style={{ display:"flex", gap:"1rem", justifyContent:"center" }}>
            {([
              { color:'w' as ChessColor, label:'White', glyph:'♔', sub:'You move first' },
              { color:'b' as ChessColor, label:'Black', glyph:'♚', sub:'AI moves first' }
            ]).map(({ color, label, glyph, sub }) => (
              <button key={color} onClick={() => startGame(color)}
                style={{ flex:1, background:"rgba(215,226,234,0.06)",
                  border:"1px solid rgba(215,226,234,0.18)", borderRadius:"1rem",
                  padding:"1.5rem 1rem", cursor:"pointer", fontFamily:"inherit",
                  transition:"background 200ms ease, border-color 200ms ease",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(215,226,234,0.12)"; e.currentTarget.style.borderColor="rgba(215,226,234,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(215,226,234,0.06)"; e.currentTarget.style.borderColor="rgba(215,226,234,0.18)"; }}
              >
                <span style={{ fontSize:"2.5rem", lineHeight:1 }}>{glyph}</span>
                <span style={{ color:"#d7e2ea", fontWeight:700, fontSize:"0.95rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</span>
                <span style={{ color:"rgba(215,226,234,0.4)", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.1em" }}>{sub}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Board screen ──
  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(0,0,0,0.95)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"1rem", fontFamily:"Kanit, sans-serif" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:"#0c0c1a", border:"1px solid rgba(215,226,234,0.15)",
          borderRadius:"1.5rem", padding:"1.5rem", maxWidth:"840px", width:"100%",
          maxHeight:"95vh", overflowY:"auto", display:"flex", flexDirection:"column", gap:"1rem" }}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h2 style={{ color:"#d7e2ea", fontSize:"1.4rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>
              ♟ Let's See Who Wins
            </h2>
            <p style={{ color:"rgba(215,226,234,0.5)", fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:"0.2rem" }}>
              {status}
            </p>
          </div>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <button onClick={reset}
              style={{ background:"rgba(215,226,234,0.1)", border:"1px solid rgba(215,226,234,0.2)",
                color:"#d7e2ea", borderRadius:"0.5rem", padding:"0.4rem 0.8rem",
                fontSize:"0.75rem", fontWeight:600, cursor:"pointer", textTransform:"uppercase",
                letterSpacing:"0.1em", fontFamily:"inherit" }}>
              New Game
            </button>
            <button onClick={onClose}
              style={{ background:"rgba(215,226,234,0.1)", border:"1px solid rgba(215,226,234,0.2)",
                color:"#d7e2ea", borderRadius:"50%", width:"2.2rem", height:"2.2rem",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Board + Log */}
        <div style={{ display:"flex", gap:"1.25rem", flexWrap:"wrap", alignItems:"flex-start" }}>
          {/* Board */}
          <div style={{ flex:"0 0 auto" }}>
            {board.map((rowArr, r) => (
              <div key={r} style={{ display:"flex", alignItems:"center" }}>
                <span style={{ width:"1.2rem", color:"rgba(215,226,234,0.35)", fontSize:"0.65rem", textAlign:"center", userSelect:"none" }}>
                  {8 - r}
                </span>
                {rowArr.map((piece, c) => {
                  const light = (r+c)%2===0;
                  const isSel = selected?.[0]===r && selected?.[1]===c;
                  const isCheckKing = kingInCheck && kingPos?.[0]===r && kingPos?.[1]===c;
                  let bg = light ? '#f0d9b5' : '#b58863';
                  if (isSel) bg = '#7fc97f';
                  if (isCheckKing) bg = '#e05555';
                  return (
                    <div key={c} onClick={() => handleClick(r,c)}
                      style={{ width:`${SQ}px`, height:`${SQ}px`, background:bg,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:(turn===humanColor&&!gameOver&&!aiThinking)?"pointer":"default",
                        fontSize:"2rem", lineHeight:1, userSelect:"none", position:"relative",
                        transition:"background 0.12s" }}>
                      {piece && (
                        <span style={{
                          color: piece.color==='w' ? '#fff' : '#111',
                          textShadow: piece.color==='w'
                            ? '0 1px 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)'
                            : '0 1px 3px rgba(255,255,255,0.2)'
                        }}>
                          {GLYPHS[piece.color][piece.type]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* File labels */}
            <div style={{ display:"flex", paddingLeft:"1.2rem" }}>
              {FILES.map(l => (
                <div key={l} style={{ width:`${SQ}px`, textAlign:"center", color:"rgba(215,226,234,0.35)", fontSize:"0.65rem", marginTop:"0.25rem", userSelect:"none" }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div style={{ flex:1, minWidth:"160px", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            <div style={{ color:"rgba(215,226,234,0.5)", fontSize:"0.65rem", textTransform:"uppercase", letterSpacing:"0.12em" }}>Move Log</div>
            <div ref={logRef} style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(215,226,234,0.08)",
              borderRadius:"0.5rem", padding:"0.75rem", height:"420px", overflowY:"auto",
              display:"flex", flexDirection:"column", gap:"0.4rem" }}>
              {log.map((entry, i) => (
                <div key={i} style={{ color: i===0 ? "#d7e2ea" : "rgba(215,226,234,0.4)",
                  fontSize:"0.72rem", lineHeight:1.5, fontWeight: i===0?500:400,
                  borderBottom:"1px solid rgba(215,226,234,0.05)", paddingBottom:"0.3rem" }}>
                  {entry}
                </div>
              ))}
            </div>
            {/* Legend — only selected + check, no legal move */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
              {[
                { color:"#7fc97f", label:"Selected" },
                { color:"#e05555", label:"King in check" }
              ].map(({ color, label }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
                  <div style={{ width:"10px", height:"10px", background:color, borderRadius:"2px" }} />
                  <span style={{ color:"rgba(215,226,234,0.4)", fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
                </div>
              ))}
            </div>
            {gameOver && (
              <button onClick={reset}
                style={{ background:"linear-gradient(135deg,#7621b0,#b600a8)", border:"none",
                  color:"#fff", borderRadius:"0.5rem", padding:"0.6rem 1rem",
                  fontSize:"0.8rem", fontWeight:700, cursor:"pointer", textTransform:"uppercase",
                  letterSpacing:"0.1em", fontFamily:"inherit" }}>
                Play Again
              </button>
            )}
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
          // Wrap at 0, not singleWidth — valid range for "right" is [-singleWidth, 0)
          if (posRef.current >= 0) posRef.current -= singleWidth;
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
      if (posRef.current >= 0 && direction === "right") posRef.current -= singleWidth;
      if (posRef.current > singleWidth && direction === "left") posRef.current -= singleWidth;
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
    if (posRef.current >= 0 && direction === "right") posRef.current -= singleWidth;
    if (posRef.current > singleWidth && direction === "left") posRef.current -= singleWidth;
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

      <div className="mx-auto max-w-7xl">
        {workExperience.map((job: WorkExp, index: number) => (
          <FadeIn delay={index * 0.1} key={`${job.company}-${index}`}>
            <article
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(100px, 0.22fr) 1fr",
                gap: "clamp(1.25rem, 4vw, 4rem)",
                alignItems: "start",
                borderTop: "1px solid rgba(215,226,234,0.1)",
                paddingTop: "clamp(2rem, 5vw, 3rem)",
                paddingBottom: "clamp(2rem, 5vw, 3rem)"
              }}
            >
              {/* Number */}
              <span
                className="hero-heading"
                style={{
                  fontSize: "clamp(3rem, 10vw, 140px)",
                  fontWeight: 900,
                  lineHeight: 0.85,
                  paddingTop: "0.25rem"
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div>
                {/* Role + Period row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "0.5rem 2rem",
                    marginBottom: "0.35rem"
                  }}
                >
                  <h3
                    style={{
                      fontSize: "clamp(1rem, 2.2vw, 2.1rem)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "#d7e2ea",
                      lineHeight: 1.2
                    }}
                  >
                    {job.role}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "rgba(215,226,234,0.35)",
                      whiteSpace: "nowrap",
                      paddingTop: "0.3rem"
                    }}
                  >
                    {job.period}
                  </span>
                </div>

                {/* Company + Location */}
                <p
                  style={{
                    fontSize: "clamp(0.85rem, 1.4vw, 1.1rem)",
                    fontWeight: 400,
                    color: "rgba(215,226,234,0.5)",
                    marginBottom: "1.25rem",
                    letterSpacing: "0.04em"
                  }}
                >
                  {job.company} &middot; {job.location}
                </p>

                {/* Highlights */}
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {job.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        fontSize: "clamp(0.82rem, 1.35vw, 1.05rem)",
                        fontWeight: 300,
                        lineHeight: 1.65,
                        color: "rgba(215,226,234,0.55)"
                      }}
                    >
                      <span style={{ marginTop: "3px", flexShrink: 0, color: "rgba(215,226,234,0.25)" }}>—</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
        <div style={{ borderTop: "1px solid rgba(215,226,234,0.1)" }} />
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

// ─── Project Full Modal ────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        overflowY: "auto"
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 10000,
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

      {/* Card */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 28 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "1100px",
          border: "2px solid #d7e2ea",
          borderRadius: "clamp(28px,3vw,48px)",
          background: "#0c0c0c",
          padding: "clamp(1.5rem,3vw,2.75rem)",
          color: "#d7e2ea",
          fontFamily: "'Kanit', sans-serif",
          marginTop: "auto",
          marginBottom: "auto"
        }}
      >
        {/* Top: number + title block */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "clamp(1rem,3vw,3rem)", alignItems: "start" }}>
          <span style={{
            color: "#d7e2ea",
            fontSize: "clamp(3rem,10vw,120px)",
            fontWeight: 900,
            lineHeight: 0.85,
            userSelect: "none"
          }}>
            {project.number}
          </span>
          <div>
            <span style={{
              display: "block",
              marginBottom: "0.85rem",
              fontSize: "clamp(0.85rem,1.6vw,1.4rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}>
              {project.category}
            </span>
            <h2 style={{
              marginBottom: "0.85rem",
              fontSize: "clamp(1.4rem,2.6vw,2.6rem)",
              fontWeight: 400,
              lineHeight: 1.15
            }}>
              {project.name}
            </h2>
            <p style={{
              color: "rgba(215,226,234,0.68)",
              fontSize: "clamp(0.92rem,1.25vw,1.12rem)",
              fontWeight: 300,
              lineHeight: 1.6,
              maxWidth: "680px"
            }}>
              {project.summary}
            </p>
            {/* Metric pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.1rem" }}>
              {project.metrics.map((metric) => (
                <strong
                  key={metric}
                  style={{
                    border: "1px solid rgba(215,226,234,0.22)",
                    borderRadius: "9999px",
                    padding: "0.35rem 0.85rem",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}
                >
                  {metric}
                </strong>
              ))}
            </div>
          </div>
        </div>

        {/* Full dashboard image */}
        <div style={{ marginTop: "clamp(1.75rem,4vw,3rem)" }}>
          <img
            src={project.image}
            alt={`${project.name} campaign dashboard`}
            style={{
              width: "100%",
              display: "block",
              borderRadius: "clamp(16px,2vw,28px)",
              border: "1px solid rgba(215,226,234,0.22)",
              background: "#ffffff",
              boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
              objectFit: "cover"
            }}
          />
        </div>

        {/* Footer hint */}
        <p style={{
          marginTop: "1.25rem",
          textAlign: "center",
          color: "rgba(215,226,234,0.25)",
          fontSize: "0.68rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase"
        }}>
          Press Esc or click outside to close
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  progress,
  total,
  onCardClick
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  total: number;
  onCardClick: (project: Project) => void;
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

      {/* Entire image area is the click target */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Expand ${project.name} full case`}
        onClick={() => onCardClick(project)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onCardClick(project);
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
            Open full case
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return (
    <>
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
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
                onCardClick={(p) => setActiveProject(p)}
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
      {showGame && <ChessGame onClose={() => setShowGame(false)} />}

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

// ─── Mobile Gate Modal ────────────────────────────────────────────────────────

function MobileGateModal({ onLetMeIn, onChess }: { onLetMeIn: () => void; onChess: () => void }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(6,6,6,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Kanit', sans-serif"
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid rgba(215,226,234,0.15)",
          borderRadius: "28px",
          background: "linear-gradient(160deg, #111111 0%, #0c0c0c 100%)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(182,0,168,0.15) inset",
          padding: "clamp(1.75rem, 6vw, 2.5rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glow accent */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "260px",
            height: "160px",
            background: "radial-gradient(ellipse at center, rgba(182,0,168,0.28) 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        />

        {/* Icon */}
        <div style={{
          fontSize: "2.6rem",
          marginBottom: "1.1rem",
          lineHeight: 1
        }}>
          🖥️
        </div>

        {/* Eyebrow label */}
        <p style={{
          color: "rgba(215,226,234,0.45)",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: "0.85rem"
        }}>
          Heads up
        </p>

        {/* Headline */}
        <h2 style={{
          background: "linear-gradient(180deg, #8e98a5 0%, #d8e7f0 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "clamp(1.6rem, 7vw, 2.1rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          marginBottom: "1rem"
        }}>
          For the full experience,<br />open me on<br />The Grand Rectangle™
        </h2>

        {/* Sub-copy */}
        <p style={{
          color: "rgba(215,226,234,0.52)",
          fontSize: "0.88rem",
          fontWeight: 300,
          lineHeight: 1.65,
          marginBottom: "2rem"
        }}>
          (That's a laptop or desktop, in case you were wondering.) This portfolio was built for big screens — animations, metrics, campaign dashboards, the works.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={onLetMeIn}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              width: "100%",
              borderRadius: "9999px",
              background: "linear-gradient(123deg, #18011f 7%, #b600a8 37%, #7621b0 72%, #be4c00 100%)",
              boxShadow: "0 4px 4px rgba(181,1,167,0.25), 4px 4px 12px #7721b1 inset",
              color: "#ffffff",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: "0.82rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              outline: "2px solid #ffffff",
              outlineOffset: "-3px",
              padding: "0.9rem 1.75rem",
              cursor: "pointer",
              border: "none",
              transition: "transform 200ms ease, filter 200ms ease"
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
          >
            Let me in anyway →
          </button>

          <button
            onClick={onChess}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              borderRadius: "9999px",
              border: "1px solid rgba(215,226,234,0.22)",
              background: "rgba(215,226,234,0.05)",
              color: "rgba(215,226,234,0.7)",
              fontFamily: "inherit",
              fontWeight: 400,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.85rem 1.5rem",
              cursor: "pointer",
              transition: "background 200ms ease, color 200ms ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(215,226,234,0.1)";
              e.currentTarget.style.color = "#d7e2ea";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(215,226,234,0.05)";
              e.currentTarget.style.color = "rgba(215,226,234,0.7)";
            }}
          >
            ♟️ I'm just here to play chess
          </button>
        </div>

        {/* Footer note */}
        <p style={{
          marginTop: "1.5rem",
          color: "rgba(215,226,234,0.25)",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase"
        }}>
          Rahul Pandey — Performance Marketer
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [showMobileGate, setShowMobileGate] = useState(false);
  const [showChessFromGate, setShowChessFromGate] = useState(false);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth < 768;
    if (isMobile) {
      setShowMobileGate(true);
    }
  }, []);

  const handleLetMeIn = () => {
    setShowMobileGate(false);
  };

  const handleChessFromGate = () => {
    setShowMobileGate(false);
    setShowChessFromGate(true);
  };

  return (
    <>
      {showMobileGate && (
        <MobileGateModal onLetMeIn={handleLetMeIn} onChess={handleChessFromGate} />
      )}
      {showChessFromGate && (
        <ChessGame onClose={() => setShowChessFromGate(false)} />
      )}
      <main className="min-h-screen overflow-x-clip bg-ink font-kanit">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <WorkExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
