// SAMSMARANA — shared cognitive game data structures
//
// These types provide a COMMON interface that all cognitive games can use,
// while allowing game-specific extensions via a typed `stats` field. They
// extend (not replace) the existing types in types.ts:
//   - ActivityCategory is reused for cognitiveSkills
//   - AttemptRecord is reused for persistence (via recordAttempt)
//   - The existing adaptiveDifficulty() function is reused
//
// Design principles:
//   1. Game-specific logic stays in each game's data file.
//   2. All games communicate through GameSession + GameResult.
//   3. Multilingual text uses the existing useTC() caption system.
//   4. No `any` types — game-specific stats are typed via generics.

import type { ActivityCategory, LanguageCode } from "./types";

// ─────────────────────────────────────────────────────────────
// 1. GAME DEFINITION
// ─────────────────────────────────────────────────────────────

export type GameType =
  | "puzzle"
  | "memory_match"
  | "remember_find"
  | "sequence"
  | "odd_one_out"
  | "snake"
  | "pack_bags"
  | "pattern"
  | "missing_object";

export type DifficultyLevel = "easy" | "medium" | "hard";

export interface GameDefinition {
  id: string;
  type: GameType;
  title: string;
  description: string;
  instructions: string;
  cognitiveSkills: ActivityCategory[];
  estimatedDurationMin: number;
  isAdaptive: boolean;
  /** Languages this game supports (all by default via the translation system) */
  supportedLanguages?: LanguageCode[];
}

// ─────────────────────────────────────────────────────────────
// 2. SHARED CHALLENGE / QUESTION STRUCTURE
// ─────────────────────────────────────────────────────────────

export type AnswerType = "single_choice" | "multi_choice" | "ordering" | "free_text" | "game_config";

export interface GameChallenge {
  id: string;
  /** The prompt/instruction for this challenge */
  prompt: string;
  /** English caption shown underneath when a non-English language is selected */
  promptCaption?: string;
  /** Cognitive skill this challenge exercises */
  cognitiveSkill: ActivityCategory;
  /** Difficulty of this individual challenge (1-5) */
  difficulty: number;
  /** What kind of answer is expected */
  answerType: AnswerType;
  /** Hint text (shown when user requests a hint) */
  hint?: string;
  hintCaption?: string;
  /** Explanation shown after answering */
  explanation?: string;
  explanationCaption?: string;
  /** Optional image/media stimulus */
  stimulusImage?: string;
  stimulusLabel?: string;
  /** For single_choice: the options + correct index */
  options?: string[];
  answerIndex?: number;
  /** For multi_choice: all option IDs + the set of correct IDs */
  optionIds?: string[];
  correctIds?: string[];
  /** For ordering: the correct sequence of items */
  sequenceItems?: { id: string; label: string; image?: string }[];
  correctOrder?: string[];
  /** For image-based options */
  imageOptions?: { image: string; label: string }[];
}

// ─────────────────────────────────────────────────────────────
// 3. SHARED DIFFICULTY STRUCTURE
// ─────────────────────────────────────────────────────────────

export interface DifficultyConfig {
  /** Current difficulty level (1-5, where 1=easy, 3=medium, 5=hard) */
  current: number;
  /** Minimum difficulty */
  min: number;
  /** Maximum difficulty */
  max: number;
  /** How much to adjust per step */
  step: number;
  /** Convert numeric level to label */
  get label(): DifficultyLevel;
}

export function difficultyLabel(level: number): DifficultyLevel {
  if (level <= 2) return "easy";
  if (level <= 3) return "medium";
  return "hard";
}

export function defaultDifficultyConfig(): DifficultyConfig {
  return {
    current: 2,
    min: 1,
    max: 5,
    step: 1,
    get label() {
      return difficultyLabel(this.current);
    },
  };
}

// ─────────────────────────────────────────────────────────────
// 4. SHARED ADAPTIVE PERFORMANCE STRUCTURE
// ─────────────────────────────────────────────────────────────

export interface GamePerformance {
  /** Total challenges attempted */
  attempts: number;
  /** Correct answers */
  correct: number;
  /** Incorrect answers */
  incorrect: number;
  /** Accuracy (0..1) */
  accuracy: number;
  /** Total response time in ms */
  totalResponseMs: number;
  /** Hints used */
  hintsUsed: number;
  /** Current difficulty at time of recording */
  currentDifficulty: number;
  /** Whether the session is complete */
  completed: boolean;
  /** Current score */
  score: number;
}

export function emptyPerformance(): GamePerformance {
  return {
    attempts: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    totalResponseMs: 0,
    hintsUsed: 0,
    currentDifficulty: 2,
    completed: false,
    score: 0,
  };
}

/**
 * Adjust difficulty based on recent performance.
 * Reuses the existing adaptiveDifficulty logic from puzzle-data.ts.
 * Gradual — never jumps more than 1 level.
 */
export function adjustDifficulty(
  current: number,
  accuracy: number,
  config?: Partial<DifficultyConfig>
): number {
  const min = config?.min ?? 1;
  const max = config?.max ?? 5;
  if (accuracy >= 0.8 && current < max) return current + 1;
  if (accuracy < 0.4 && current > min) return current - 1;
  return current;
}

// ─────────────────────────────────────────────────────────────
// 5. SHARED SCORE STRUCTURE
// ─────────────────────────────────────────────────────────────

export interface GameScore {
  currentScore: number;
  pointsEarned: number;
  correctAnswers: number;
  completedChallenges: number;
  totalChallenges: number;
}

export function emptyScore(totalChallenges: number): GameScore {
  return {
    currentScore: 0,
    pointsEarned: 0,
    correctAnswers: 0,
    completedChallenges: 0,
    totalChallenges,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. SHARED GAME SESSION STRUCTURE
// ─────────────────────────────────────────────────────────────

export interface GameSession<TStats = Record<string, unknown>> {
  sessionId: string;
  /** Reuses profile.id from the existing Profile type */
  profileId: string;
  gameId: string;
  gameType: GameType;
  startTime: string; // ISO
  endTime?: string; // ISO
  difficulty: DifficultyConfig;
  score: GameScore;
  performance: GamePerformance;
  completed: boolean;
  challengesAttempted: number;
  /** Adaptive changes made during the session (for auditing) */
  adaptiveChanges: { from: number; to: number; atChallenge: number }[];
  /** Game-specific statistics (typed per game) */
  stats: TStats;
}

export function newSession(
  profileId: string,
  game: GameDefinition,
  totalChallenges: number,
  stats: Record<string, unknown> = {}
): GameSession {
  return {
    sessionId: crypto.randomUUID(),
    profileId,
    gameId: game.id,
    gameType: game.type,
    startTime: new Date().toISOString(),
    difficulty: defaultDifficultyConfig(),
    score: emptyScore(totalChallenges),
    performance: emptyPerformance(),
    completed: false,
    challengesAttempted: 0,
    adaptiveChanges: [],
    stats,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. SHARED GAME RESULT STRUCTURE
// ─────────────────────────────────────────────────────────────

export interface GameResult<TStats = Record<string, unknown>> {
  gameId: string;
  gameType: GameType;
  score: number;
  accuracy: number;
  completed: boolean;
  durationMs: number;
  challengesAttempted: number;
  /** Summary of performance for display */
  performanceSummary: string;
  /** Updated difficulty for the next session */
  updatedDifficulty: number;
  /** Game-specific statistics */
  stats: TStats;
}

/**
 * Convert a GameSession into a GameResult when the session ends.
 */
export function sessionToResult<TStats>(
  session: GameSession<TStats>
): GameResult<TStats> {
  const durationMs = session.endTime
    ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
    : 0;
  const correctPct = session.score.totalChallenges > 0
    ? Math.round((session.score.correctAnswers / session.score.totalChallenges) * 100)
    : 0;
  return {
    gameId: session.gameId,
    gameType: session.gameType,
    score: session.score.currentScore,
    accuracy: session.performance.accuracy,
    completed: session.completed,
    durationMs,
    challengesAttempted: session.challengesAttempted,
    performanceSummary: `${session.score.correctAnswers} of ${session.score.totalChallenges} correct (${correctPct}%)`,
    updatedDifficulty: session.difficulty.current,
    stats: session.stats,
  };
}

// ─────────────────────────────────────────────────────────────
// 8. GAME-SPECIFIC STATS (typed extensions)
// ─────────────────────────────────────────────────────────────

export interface SnakeStats {
  applesCollected: number;
  snakeLength: number;
  collisions: number;
  maxGridSize: number;
}

export interface MemoryMatchStats {
  pairsMatched: number;
  totalAttempts: number;
  moves: number;
}

export interface SequenceStats {
  sequencesCompleted: number;
  orderingAccuracy: number;
}

export interface PackBagsStats {
  scenariosCompleted: number;
  correctPacks: number;
  incorrectPacks: number;
  recallCorrect: number;
  hintsUsed: number;
}

export interface PuzzleStats {
  puzzlesSolved: number;
  byType: Partial<Record<GameType, number>>;
}

// ─────────────────────────────────────────────────────────────
// 9. GAME REGISTRY (optional — games can self-register)
// ─────────────────────────────────────────────────────────────

export const GAME_DEFINITIONS: GameDefinition[] = [
  {
    id: "puzzle-games",
    type: "puzzle",
    title: "Visual Puzzle Games",
    description: "Odd-one-out, patterns, sequences, counting & more with real photographs.",
    instructions: "Look at the pictures and solve the visual puzzle.",
    cognitiveSkills: ["problem_solving", "recognition", "attention"],
    estimatedDurationMin: 3,
    isAdaptive: true,
  },
  {
    id: "memory-match",
    type: "memory_match",
    title: "Memory Match",
    description: "Find matching pairs of real photographs.",
    instructions: "Flip cards to find matching pairs.",
    cognitiveSkills: ["recall", "concentration"],
    estimatedDurationMin: 3,
    isAdaptive: true,
  },
  {
    id: "snake-game",
    type: "snake",
    title: "Snake Game",
    description: "A slow, gentle snake game. Eat apples!",
    instructions: "Guide the snake to eat apples using the arrow buttons.",
    cognitiveSkills: ["concentration", "attention"],
    estimatedDurationMin: 5,
    isAdaptive: true,
  },
  {
    id: "pack-your-bags",
    type: "pack_bags",
    title: "Pack Your Bags",
    description: "Choose the right items for everyday situations!",
    instructions: "Select the objects you should pack for the given situation.",
    cognitiveSkills: ["problem_solving", "recall", "attention"],
    estimatedDurationMin: 4,
    isAdaptive: true,
  },
];

export function gameDefinitionById(id: string): GameDefinition | undefined {
  return GAME_DEFINITIONS.find((g) => g.id === id);
}

export function gameDefinitionByType(type: GameType): GameDefinition | undefined {
  return GAME_DEFINITIONS.find((g) => g.type === type);
}
