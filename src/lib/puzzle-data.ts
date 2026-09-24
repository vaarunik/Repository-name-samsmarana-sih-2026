// SAMSMARANA — visual puzzle game engine (image-based)
// Every puzzle uses REALISTIC PHOTOGRAPHS from /public/images/ as visual
// stimuli. No text-only rounds, no emojis, no icons, no abstract shapes.
// Images rotate across sessions using the full pool of scene + story images.

import type { SceneKey } from "./types";
import type { LanguageCode } from "./i18n";
import { gt } from "./game-i18n";

// ── Image pool: all available realistic photographs ────────────────
export interface SceneImage {
  id: string;
  image: string;
  label: string;
  category: "nature" | "food" | "indoor" | "travel" | "community" | "cultural";
}

export const SCENE_IMAGES: SceneImage[] = [
  { id: "garden", image: "/images/activities/garden.png", label: "Garden", category: "nature" },
  { id: "market", image: "/images/activities/market.png", label: "Vegetable Market", category: "food" },
  { id: "shop", image: "/images/activities/shop.png", label: "Local Shop", category: "indoor" },
  { id: "cooking", image: "/images/activities/cooking.png", label: "Kitchen", category: "indoor" },
  { id: "tea", image: "/images/activities/tea.png", label: "Tea Preparation", category: "food" },
  { id: "train", image: "/images/activities/train.png", label: "Train Journey", category: "travel" },
  { id: "nature", image: "/images/activities/nature.png", label: "Nature", category: "nature" },
  { id: "birds", image: "/images/activities/birds.png", label: "Garden Birds", category: "nature" },
  { id: "home", image: "/images/activities/home.png", label: "Home", category: "indoor" },
  { id: "community", image: "/images/activities/community.png", label: "Community Courtyard", category: "community" },
  { id: "river", image: "/images/activities/river.png", label: "River", category: "nature" },
  { id: "festival", image: "/images/activities/festival.png", label: "Festival", category: "cultural" },
];

// Story scene images (grouped by story, for sequencing)
export interface StorySequence {
  storyId: string;
  title: string;
  images: { image: string; label: string }[];
}

export const STORY_SEQUENCES: StorySequence[] = [
  {
    storyId: "market",
    title: "A Morning at the Vegetable Market",
    images: [
      { image: "/images/story/market/s1.png", label: "Arriving" },
      { image: "/images/story/market/s2.png", label: "Looking" },
      { image: "/images/story/market/s3.png", label: "Choosing" },
      { image: "/images/story/market/s4.png", label: "Weighing" },
      { image: "/images/story/market/s5.png", label: "Paying" },
      { image: "/images/story/market/s6.png", label: "Packing" },
      { image: "/images/story/market/s7.png", label: "Leaving" },
    ],
  },
  {
    storyId: "tea",
    title: "Preparing Morning Tea",
    images: [
      { image: "/images/story/tea/s1.png", label: "Filling kettle" },
      { image: "/images/story/tea/s2.png", label: "Heating water" },
      { image: "/images/story/tea/s3.png", label: "Adding tea" },
      { image: "/images/story/tea/s4.png", label: "Pouring tea" },
      { image: "/images/story/tea/s5.png", label: "Tea ready" },
      { image: "/images/story/tea/s6.png", label: "Sharing tea" },
    ],
  },
  {
    storyId: "garden",
    title: "A Morning in the Garden",
    images: [
      { image: "/images/story/garden/s1.png", label: "Entering" },
      { image: "/images/story/garden/s2.png", label: "Roses" },
      { image: "/images/story/garden/s3.png", label: "Marigolds" },
      { image: "/images/story/garden/s4.png", label: "Watering can" },
      { image: "/images/story/garden/s5.png", label: "Watering" },
      { image: "/images/story/garden/s6.png", label: "Resting" },
    ],
  },
  {
    storyId: "shop",
    title: "A Visit to the Local Shop",
    images: [
      { image: "/images/story/shop/s1.png", label: "Approaching" },
      { image: "/images/story/shop/s2.png", label: "Browsing" },
      { image: "/images/story/shop/s3.png", label: "Asking" },
      { image: "/images/story/shop/s4.png", label: "Items on counter" },
      { image: "/images/story/shop/s5.png", label: "Paying" },
      { image: "/images/story/shop/s6.png", label: "Leaving" },
    ],
  },
  {
    storyId: "meal",
    title: "Preparing a Family Meal",
    images: [
      { image: "/images/story/meal/s1.png", label: "Washing" },
      { image: "/images/story/meal/s2.png", label: "Cutting" },
      { image: "/images/story/meal/s3.png", label: "Heating pot" },
      { image: "/images/story/meal/s4.png", label: "Adding spices" },
      { image: "/images/story/meal/s5.png", label: "Stirring" },
      { image: "/images/story/meal/s6.png", label: "Serving" },
      { image: "/images/story/meal/s7.png", label: "Family gathers" },
    ],
  },
  {
    storyId: "visit",
    title: "A Family Visit",
    images: [
      { image: "/images/story/visit/s1.png", label: "Arriving" },
      { image: "/images/story/visit/s2.png", label: "Greeting" },
      { image: "/images/story/visit/s3.png", label: "Sitting" },
      { image: "/images/story/visit/s4.png", label: "Serving tea" },
      { image: "/images/story/visit/s5.png", label: "Photographs" },
      { image: "/images/story/visit/s6.png", label: "Farewell" },
    ],
  },
  {
    storyId: "fruit",
    title: "Going to the Fruit Market",
    images: [
      { image: "/images/story/fruit/s1.png", label: "Arriving" },
      { image: "/images/story/fruit/s2.png", label: "Examining" },
      { image: "/images/story/fruit/s3.png", label: "Handing" },
      { image: "/images/story/fruit/s4.png", label: "Weighing" },
      { image: "/images/story/fruit/s5.png", label: "Paying" },
      { image: "/images/story/fruit/s6.png", label: "Leaving" },
    ],
  },
  {
    storyId: "evening",
    title: "An Evening at Home",
    images: [
      { image: "/images/story/evening/s1.png", label: "Lighting lamp" },
      { image: "/images/story/evening/s2.png", label: "Settling" },
      { image: "/images/story/evening/s3.png", label: "Tablet" },
      { image: "/images/story/evening/s4.png", label: "Pouring tea" },
      { image: "/images/story/evening/s5.png", label: "Newspaper" },
      { image: "/images/story/evening/s6.png", label: "Resting" },
    ],
  },
];

export type PuzzleType =
  | "visual_recognition"
  | "visual_odd_one_out"
  | "visual_sequence"
  | "visual_pattern"
  | "visual_counting"
  | "visual_missing_scene";

export interface PuzzleQuestion {
  id: string;
  type: PuzzleType;
  prompt: string;
  /** The main stimulus image shown during observe phase */
  stimulusImage?: string;
  stimulusLabel?: string;
  /** For counting: the correct count */
  correctCount?: number;
  /** For MCQ: image-based options */
  imageOptions?: { image: string; label: string }[];
  answerImage?: string;
  answerIndex: number;
  options: string[];
  answer: string;
  explanation: string;
  /** For sequence: the correct ordered images */
  correctSequence?: { image: string; label: string }[];
  /** For sequence: shuffled images for the user to arrange */
  shuffledSequence?: { image: string; label: string }[];
  /** For missing-scene: the scenes shown */
  shownScenes?: { image: string; label: string }[];
  missingScene?: { image: string; label: string };
}

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

// ── Puzzle builders ────────────────────────────────────────────────

function buildVisualRecognition(lang: LanguageCode): PuzzleQuestion {
  const target = SCENE_IMAGES[Math.floor(Math.random() * SCENE_IMAGES.length)];
  const others = pick(SCENE_IMAGES.filter((s) => s.id !== target.id), 3);
  const imageOptions = shuffle([target, ...others]).map((s) => ({ image: s.image, label: s.label }));
  return {
    id: `vr-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_recognition",
    prompt: gt(lang, "puzzle.whichPicture"),
    stimulusImage: target.image,
    stimulusLabel: target.label,
    imageOptions,
    answerImage: target.image,
    answerIndex: imageOptions.findIndex((o) => o.image === target.image),
    options: imageOptions.map((o) => o.label),
    answer: target.label,
    explanation: `You saw the ${target.label.toLowerCase()} picture.`,
  };
}

function buildVisualOddOneOut(lang: LanguageCode): PuzzleQuestion {
  // Pick a category, get 3 from that category + 1 from a different category
  const categories = ["nature", "food", "indoor", "travel", "community", "cultural"];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const sameCategory = SCENE_IMAGES.filter((s) => s.category === cat);
  const otherCategory = SCENE_IMAGES.filter((s) => s.category !== cat);
  if (sameCategory.length < 3 || otherCategory.length < 1) return buildVisualRecognition(lang);
  const same = pick(sameCategory, 3);
  const odd = pick(otherCategory, 1)[0];
  const imageOptions = shuffle([...same, odd]).map((s) => ({ image: s.image, label: s.label }));
  return {
    id: `ooo-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_odd_one_out",
    prompt: gt(lang, "puzzle.notBelong"),
    imageOptions,
    answerImage: odd.image,
    answerIndex: imageOptions.findIndex((o) => o.image === odd.image),
    options: imageOptions.map((o) => o.label),
    answer: odd.label,
    explanation: `The ${odd.label} is different — the others are all ${cat} scenes.`,
  };
}

function buildVisualSequence(difficulty: number, lang: LanguageCode): PuzzleQuestion {
  const story = STORY_SEQUENCES[Math.floor(Math.random() * STORY_SEQUENCES.length)];
  const stepCount = Math.min(3 + Math.floor(difficulty / 2), 4);
  const startIdx = Math.floor(Math.random() * (story.images.length - stepCount));
  const correct = story.images.slice(startIdx, startIdx + stepCount);
  const shuffled = shuffle(correct);
  return {
    id: `seq-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_sequence",
    prompt: gt(lang, "puzzle.arrange", { story: story.title }),
    correctSequence: correct,
    shuffledSequence: shuffled,
    answerIndex: -1,
    options: shuffled.map((s) => s.label),
    answer: correct.map((s) => s.label).join(" → "),
    explanation: `The correct order is: ${correct.map((s) => s.label).join(" → ")}.`,
  };
}

function buildVisualPattern(lang: LanguageCode): PuzzleQuestion {
  // Show ABAB pattern with scene images
  const [a, b] = pick(SCENE_IMAGES, 2);
  const pattern = [a, b, a, b];
  const wrongs = pick(SCENE_IMAGES.filter((s) => s.id !== a.id && s.id !== b.id), 3);
  const imageOptions = shuffle([a, ...wrongs]).map((s) => ({ image: s.image, label: s.label }));
  return {
    id: `pat-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_pattern",
    prompt: gt(lang, "puzzle.nextPattern"),
    stimulusImage: pattern.map((p) => p.image).join(","),
    stimulusLabel: pattern.map((p) => p.label).join(" → "),
    imageOptions,
    answerImage: a.image,
    answerIndex: imageOptions.findIndex((o) => o.image === a.image),
    options: imageOptions.map((o) => o.label),
    answer: a.label,
    explanation: `The pattern repeats: ${a.label} → ${b.label} → ${a.label} → ${b.label} → ${a.label}.`,
  };
}

function buildVisualCounting(lang: LanguageCode): PuzzleQuestion {
  // Use a scene image + ask how many of a specific object
  // Use the content pack data from questions.ts
  const sceneCounts: Record<string, { image: string; label: string; object: string; count: number }[]> = {
    garden: [
      { image: "/images/activities/garden.png", label: "Garden", object: "roses", count: 3 },
      { image: "/images/activities/garden.png", label: "Garden", object: "marigolds", count: 5 },
    ],
    market: [
      { image: "/images/activities/market.png", label: "Market", object: "tomatoes", count: 6 },
      { image: "/images/activities/market.png", label: "Market", object: "pumpkins", count: 2 },
    ],
    festival: [
      { image: "/images/activities/festival.png", label: "Festival", object: "diyas", count: 4 },
    ],
    home: [
      { image: "/images/activities/home.png", label: "Home", object: "bananas", count: 3 },
    ],
  };
  const allCounts = Object.values(sceneCounts).flat();
  const target = allCounts[Math.floor(Math.random() * allCounts.length)];
  const wrongs = [target.count + 1, target.count - 1, target.count + 2].filter((n) => n > 0 && n !== target.count);
  const options = shuffle([String(target.count), ...wrongs.slice(0, 3).map(String)]);
  return {
    id: `cnt-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_counting",
    prompt: gt(lang, "puzzle.howMany", { obj: target.object }),
    stimulusImage: target.image,
    stimulusLabel: target.label,
    options,
    answer: String(target.count),
    answerIndex: options.indexOf(String(target.count)),
    correctCount: target.count,
    explanation: `There ${target.count === 1 ? "is 1" : `are ${target.count}`} ${target.object} in the picture.`,
  };
}

function buildVisualMissingScene(lang: LanguageCode): PuzzleQuestion {
  const shown = pick(SCENE_IMAGES, 3);
  const missing = shown[shown.length - 1];
  const displayed = shown.slice(0, -1);
  const wrongs = pick(SCENE_IMAGES.filter((s) => !shown.includes(s)), 3);
  const imageOptions = shuffle([missing, ...wrongs]).map((s) => ({ image: s.image, label: s.label }));
  return {
    id: `ms-${Math.random().toString(36).slice(2, 8)}`,
    type: "visual_missing_scene",
    prompt: gt(lang, "puzzle.missing"),
    shownScenes: displayed.map((s) => ({ image: s.image, label: s.label })),
    missingScene: { image: missing.image, label: missing.label },
    imageOptions,
    answerImage: missing.image,
    answerIndex: imageOptions.findIndex((o) => o.image === missing.image),
    options: imageOptions.map((o) => o.label),
    answer: missing.label,
    explanation: `The ${missing.label} picture was missing.`,
  };
}

const BUILDERS: ((d: number, lang: LanguageCode) => PuzzleQuestion)[] = [
  (d, lang) => buildVisualRecognition(lang),
  (d, lang) => buildVisualOddOneOut(lang),
  (d, lang) => buildVisualSequence(d, lang),
  (d, lang) => buildVisualPattern(lang),
  (d, lang) => buildVisualCounting(lang),
  (d, lang) => buildVisualMissingScene(lang),
];

export function buildPuzzleSet(difficulty: number, count = 4, lang: LanguageCode = "en"): PuzzleQuestion[] {
  const builders = shuffle(BUILDERS).slice(0, Math.min(count, BUILDERS.length));
  const out = builders.map((b) => b(difficulty, lang));
  while (out.length < count) {
    out.push(BUILDERS[Math.floor(Math.random() * BUILDERS.length)](difficulty, lang));
  }
  return out;
}

export function adaptiveDifficulty(currentDifficulty: number, accuracy: number): number {
  if (accuracy >= 0.8 && currentDifficulty < 5) return currentDifficulty + 1;
  if (accuracy < 0.4 && currentDifficulty > 1) return currentDifficulty - 1;
  return currentDifficulty;
}

// ── Memory Match with real images ──────────────────────────────────
export interface MemoryCard {
  id: number;
  image: string;
  label: string;
  matched: boolean;
}

export function buildMemoryCards(difficulty: number): MemoryCard[] {
  const pairCount = Math.min(3 + Math.floor(difficulty / 2), 6);
  const items = pick(SCENE_IMAGES, pairCount);
  const cards = shuffle([...items, ...items]).map((s, i) => ({
    id: i,
    image: s.image,
    label: s.label,
    matched: false,
  }));
  return cards;
}

// ── Snake config (unchanged, already visual) ───────────────────────
export interface SnakeConfig {
  gridSize: number;
  speedMs: number;
}

export function snakeConfig(difficulty: number): SnakeConfig {
  const gridSize = Math.min(8 + difficulty * 2, 16);
  const speedMs = Math.max(500 - difficulty * 50, 200);
  return { gridSize, speedMs };
}
