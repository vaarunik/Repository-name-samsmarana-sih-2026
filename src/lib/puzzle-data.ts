// SAMSMARANA — adaptive puzzle game engine
// Generates varied puzzle content for: odd-one-out, pattern completion,
// missing-object, remember-and-find, sequence arrangement, and shape matching.
// Difficulty adapts based on recent accuracy.

import type { Question } from "./types";

export type PuzzleType =
  | "odd_one_out"
  | "remember_find"
  | "sequence"
  | "pattern"
  | "missing_object";

export interface PuzzleQuestion {
  id: string;
  type: PuzzleType;
  prompt: string;
  /** The correct answer */
  answer: string;
  /** All options (including the correct one), shuffled */
  options: string[];
  /** Index of the correct answer in options */
  answerIndex: number;
  explanation: string;
  /** For sequence puzzles: the correct ordered sequence */
  correctSequence?: string[];
  /** For remember-find: the objects that were shown */
  shownObjects?: string[];
}

// ── Content pools (familiar everyday objects, food, etc.) ──────────
const FOODS = ["apple", "banana", "mango", "rice", "bread", "tomato", "potato", "tea", "milk", "egg"];
const HOUSEHOLD = ["cup", "plate", "spoon", "bowl", "lamp", "basket", "broom", "key", "clock", "mirror"];
const NATURE = ["tree", "flower", "bird", "river", "hill", "cloud", "leaf", "stone", "sun", "moon"];
const CLOTHING = ["shirt", "saree", "shoe", "hat", "sock", "scarf", "glove", "belt"];

const ALL_POOLS = [FOODS, HOUSEHOLD, NATURE, CLOTHING];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// ── Everyday sequences (for sequence puzzle) ───────────────────────
const SEQUENCES: { steps: string[]; prompt: string }[] = [
  { steps: ["Wash hands", "Serve food", "Eat food", "Clean plate"], prompt: "Arrange the steps of a meal in order." },
  { steps: ["Boil water", "Add tea leaves", "Pour into cup", "Drink tea"], prompt: "Arrange the steps of making tea in order." },
  { steps: ["Wake up", "Brush teeth", "Take bath", "Eat breakfast"], prompt: "Arrange the morning routine in order." },
  { steps: ["Soil the pot", "Plant the seed", "Water the plant", "Flower blooms"], prompt: "Arrange the steps of growing a plant in order." },
  { steps: ["Buy vegetables", "Wash vegetables", "Cut vegetables", "Cook vegetables"], prompt: "Arrange the steps of cooking vegetables in order." },
  { steps: ["Light the lamp", "Offer flowers", "Pray", "Distribute prasad"], prompt: "Arrange the steps of a prayer in order." },
];

// ── Pattern completion ─────────────────────────────────────────────
const PATTERNS: { sequence: string[]; answer: string; prompt: string }[] = [
  { sequence: ["apple", "banana", "apple", "banana", "?"], answer: "apple", prompt: "What comes next in the pattern?" },
  { sequence: ["cup", "plate", "cup", "plate", "?"], answer: "cup", prompt: "What comes next in the pattern?" },
  { sequence: ["tree", "tree", "flower", "tree", "tree", "?"], answer: "flower", prompt: "What comes next in the pattern?" },
  { sequence: ["big", "small", "big", "small", "?"], answer: "big", prompt: "What comes next in the pattern?" },
  { sequence: ["sun", "moon", "sun", "moon", "?"], answer: "sun", prompt: "What comes next in the pattern?" },
];

// ── Builders ───────────────────────────────────────────────────────

function buildOddOneOut(difficulty: number): PuzzleQuestion {
  const pool = ALL_POOLS[Math.floor(Math.random() * ALL_POOLS.length)];
  const otherPool = ALL_POOLS.find((p) => p !== pool)!;
  const count = Math.min(3 + Math.floor(difficulty / 2), 5);
  const sameItems = pick(pool, count);
  const oddOne = pick(otherPool, 1)[0];
  const options = shuffle([...sameItems, oddOne]);
  return {
    id: `odd-${Math.random().toString(36).slice(2, 8)}`,
    type: "odd_one_out",
    prompt: "Which one does NOT belong with the others?",
    answer: oddOne,
    options: options.map(capitalize),
    answerIndex: options.indexOf(oddOne),
    explanation: `The ${oddOne} is different from the ${pool[0]}s and similar items.`,
  };
}

function buildRememberFind(difficulty: number): PuzzleQuestion {
  const pool = ALL_POOLS[Math.floor(Math.random() * ALL_POOLS.length)];
  const showCount = Math.min(3 + Math.floor(difficulty / 2), 5);
  const shown = pick(pool, showCount);
  const otherPool = ALL_POOLS.find((p) => p !== pool) ?? HOUSEHOLD;
  const wrong = pick(otherPool, 3);
  // Ask about one of the shown objects
  const target = shown[Math.floor(Math.random() * shown.length)];
  const options = shuffle([target, ...wrong]);
  return {
    id: `rf-${Math.random().toString(36).slice(2, 8)}`,
    type: "remember_find",
    prompt: "Which object was shown to you earlier?",
    answer: target,
    options: options.map(capitalize),
    answerIndex: options.indexOf(target),
    explanation: `The ${target} was one of the objects shown to you.`,
    shownObjects: shown,
  };
}

function buildSequence(difficulty: number): PuzzleQuestion {
  const seq = SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)];
  const stepCount = Math.min(3 + Math.floor(difficulty / 2), seq.steps.length);
  const steps = seq.steps.slice(0, stepCount);
  const shuffled = shuffle(steps);
  return {
    id: `seq-${Math.random().toString(36).slice(2, 8)}`,
    type: "sequence",
    prompt: seq.prompt,
    answer: steps.join(" → "),
    options: shuffled,
    answerIndex: -1, // sequence puzzles are arranged, not selected
    explanation: `The correct order is: ${steps.join(" → ")}.`,
    correctSequence: steps,
  };
}

function buildPattern(difficulty: number): PuzzleQuestion {
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const pool = [...new Set(pattern.sequence.filter((s) => s !== "?"))];
  const wrongs = shuffle(FOODS.concat(HOUSEHOLD).filter((x) => !pool.includes(x))).slice(0, 3);
  const options = shuffle([pattern.answer, ...wrongs]);
  return {
    id: `pat-${Math.random().toString(36).slice(2, 8)}`,
    type: "pattern",
    prompt: `${pattern.prompt}\n${pattern.sequence.join(" → ")}`,
    answer: pattern.answer,
    options: options.map(capitalize),
    answerIndex: options.indexOf(pattern.answer),
    explanation: `The pattern repeats, so "${pattern.answer}" comes next.`,
  };
}

function buildMissingObject(difficulty: number): PuzzleQuestion {
  const pool = ALL_POOLS[Math.floor(Math.random() * ALL_POOLS.length)];
  const count = Math.min(3 + Math.floor(difficulty / 2), 5);
  const items = pick(pool, count);
  const missing = items[items.length - 1];
  const shown = items.slice(0, -1);
  const wrongs = pick(pool.filter((x) => !items.includes(x)), 3);
  const options = shuffle([missing, ...wrongs]);
  return {
    id: `mo-${Math.random().toString(36).slice(2, 8)}`,
    type: "missing_object",
    prompt: `You saw: ${shown.map(capitalize).join(", ")}\nWhich object is missing?`,
    answer: missing,
    options: options.map(capitalize),
    answerIndex: options.indexOf(missing),
    explanation: `The ${missing} was missing from the list.`,
    shownObjects: shown,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const BUILDERS: Record<PuzzleType, (difficulty: number) => PuzzleQuestion> = {
  odd_one_out: buildOddOneOut,
  remember_find: buildRememberFind,
  sequence: buildSequence,
  pattern: buildPattern,
  missing_object: buildMissingObject,
};

const ALL_TYPES: PuzzleType[] = ["odd_one_out", "remember_find", "pattern", "missing_object", "sequence"];

/**
 * Build a set of varied puzzle questions. Each call produces different content.
 * Difficulty (1-5) controls the number of items and options.
 */
export function buildPuzzleSet(difficulty: number, count = 4): PuzzleQuestion[] {
  const types = shuffle(ALL_TYPES).slice(0, Math.min(count, ALL_TYPES.length));
  const out: PuzzleQuestion[] = [];
  for (const type of types) {
    out.push(BUILDERS[type](difficulty));
  }
  // If we need more questions than types, add random ones
  while (out.length < count) {
    const type = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
    out.push(BUILDERS[type](difficulty));
  }
  return out;
}

/**
 * Adaptive difficulty: based on recent accuracy (0-1), adjust the next
 * difficulty level. Strong performance → +1 (cap 5). Weak → -1 (floor 1).
 * Gradual — never jumps more than 1 level.
 */
export function adaptiveDifficulty(currentDifficulty: number, accuracy: number): number {
  if (accuracy >= 0.8 && currentDifficulty < 5) return currentDifficulty + 1;
  if (accuracy < 0.4 && currentDifficulty > 1) return currentDifficulty - 1;
  return currentDifficulty;
}

// ── Memory Match game data ─────────────────────────────────────────
export interface MemoryCard {
  id: number;
  label: string;
  matched: boolean;
}

export function buildMemoryCards(difficulty: number): MemoryCard[] {
  const pool = ALL_POOLS[Math.floor(Math.random() * ALL_POOLS.length)];
  const pairCount = Math.min(3 + Math.floor(difficulty / 2), 6);
  const items = pick(pool, pairCount);
  const cards = shuffle([...items, ...items]).map((label, i) => ({
    id: i,
    label: capitalize(label),
    matched: false,
  }));
  return cards;
}

// ── Snake game config (dementia-friendly) ──────────────────────────
export interface SnakeConfig {
  gridSize: number;
  speedMs: number;
}

export function snakeConfig(difficulty: number): SnakeConfig {
  // Start very easy: slow speed, small grid. Gradually increase.
  const gridSize = Math.min(8 + difficulty * 2, 16);
  const speedMs = Math.max(500 - difficulty * 50, 200);
  return { gridSize, speedMs };
}
