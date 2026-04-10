import puzzles from "@/data/puzzles";

const COLOR_TO_HEX = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#facc15",
  orange: "#f97316",
  pink: "#e879f9",
};

const toLevel = (puzzle) => ({
  id: puzzle.id,
  size: 5,
  difficulty: "normal",
  pairs: puzzle.pairs.map((pair) => ({
    pairId: pair.color,
    color: COLOR_TO_HEX[pair.color] || "#94a3b8",
    start: { r: pair.a[0], c: pair.a[1] },
    end: { r: pair.b[0], c: pair.b[1] },
  })),
});

export const LEVELS = { 5: Object.values(puzzles).map(toLevel) };

export const getLevelsBySize = () => LEVELS[5];

export const getLevel = (_size, levelId) =>
  LEVELS[5].find((level) => String(level.id) === String(levelId));
