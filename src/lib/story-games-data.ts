// SAMSMARANA — Story Games data
//
// Short visual stories (5–7 scenes) designed around familiar everyday
// experiences. Each scene uses a realistic image with a Ken Burns motion
// direction to simulate camera movement (no AI video needed). After the
// story finishes, the visuals are HIDDEN and memory questions test recall.
//
// Stories are regionally adaptable via `regionTags` (which regions the
// story fits naturally) and `interests` (which interests it matches).

import type { Question, SceneKey } from "./types";

/** Ken Burns motion direction for a scene image */
export type KenBurns = "zoom-in" | "zoom-out" | "pan-left" | "pan-right" | "pan-up" | "pan-down";

export interface StoryScene {
  /** base image (reused with different Ken Burns directions per scene) */
  image: string;
  /** alt text for accessibility (not visibly displayed during questions) */
  alt: string;
  narration: string;
  caption: string;
  /** motion direction for this scene */
  motion: KenBurns;
  /** optional floating accent icon (lucide name) + label for the scene */
  accent?: { icon: string; label: string };
}

export interface StoryGame {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  /** which scene key the story is set in (for image reuse) */
  scene: SceneKey;
  scenes: StoryScene[];
  questions: Question[];
  /** regions this story fits naturally (empty = universal) */
  regionTags: string[];
  interests: string[];
  icon: string;
}

function q(
  skill: Question["skill"],
  prompt: string,
  correct: string,
  wrongs: string[],
  explanation: string
): Question {
  const options = shuffle([correct, ...wrongs]);
  return {
    id: `${skill}-${Math.random().toString(36).slice(2, 8)}`,
    skill,
    prompt,
    options,
    answerIndex: options.indexOf(correct),
    explanation,
  };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const STORY_GAMES: StoryGame[] = [
  {
    id: "story-vegetable-market",
    title: "A Morning at the Vegetable Market",
    description: "Follow Amma's morning visit to the local vegetable market.",
    difficulty: "Moderate",
    scene: "market",
    icon: "ShoppingBasket",
    regionTags: ["Assam", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh"],
    interests: ["Market", "Cooking", "Family"],
    scenes: [
      {
        image: "/images/activities/market.png",
        alt: "An older woman entering a small local vegetable market",
        narration: "Amma visits the vegetable market in the morning.",
        caption: "Scene 1 — Arriving at the market",
        motion: "zoom-in",
        accent: { icon: "Footprints", label: "Arriving" },
      },
      {
        image: "/images/activities/market.png",
        alt: "Vegetables displayed in baskets at the market stall",
        narration: "She looks at the fresh vegetables before choosing what to buy.",
        caption: "Scene 2 — Looking at the vegetables",
        motion: "pan-right",
        accent: { icon: "Eye", label: "Looking" },
      },
      {
        image: "/images/activities/market.png",
        alt: "A hand selecting vegetables from the stall",
        narration: "Amma chooses tomatoes and vegetables for the day.",
        caption: "Scene 3 — Choosing vegetables",
        motion: "zoom-in",
        accent: { icon: "Hand", label: "Choosing" },
      },
      {
        image: "/images/activities/market.png",
        alt: "Vegetables being weighed on a scale",
        narration: "The shopkeeper weighs the vegetables on the scale.",
        caption: "Scene 4 — Weighing",
        motion: "pan-left",
        accent: { icon: "Scale", label: "Weighing" },
      },
      {
        image: "/images/activities/market.png",
        alt: "Payment being made at the market stall",
        narration: "Amma pays the shopkeeper for the vegetables.",
        caption: "Scene 5 — Paying",
        motion: "zoom-out",
        accent: { icon: "Coins", label: "Paying" },
      },
      {
        image: "/images/activities/market.png",
        alt: "Vegetables being packed into a bag",
        narration: "The shopkeeper packs the vegetables into a bag.",
        caption: "Scene 6 — Packing",
        motion: "pan-up",
        accent: { icon: "ShoppingBag", label: "Packing" },
      },
      {
        image: "/images/activities/market.png",
        alt: "Amma leaving the market with her bag of vegetables",
        narration: "Amma leaves the market with her bag of vegetables.",
        caption: "Scene 7 — Leaving",
        motion: "zoom-out",
        accent: { icon: "Footprints", label: "Leaving" },
      },
    ],
    questions: [
      q("sequencing", "What did Amma do first?", "She entered the market", ["She paid for the vegetables", "She left the market", "She packed the vegetables"], "Amma entered the market first, at the start of the story."),
      q("sequencing", "What happened after Amma selected the vegetables?", "The shopkeeper weighed them", ["Amma left the market", "Amma entered the market", "The vegetables were packed into a bag"], "After Amma chose the vegetables, the shopkeeper weighed them on the scale."),
      q("sequencing", "What was done before Amma paid?", "The vegetables were weighed", ["The vegetables were packed", "Amma left the market", "Amma entered the market"], "The vegetables were weighed before Amma paid."),
      q("sequencing", "What happened at the end?", "Amma left with her bag of vegetables", ["Amma entered the market", "The shopkeeper weighed the vegetables", "Amma chose vegetables"], "At the end, Amma left the market with her bag of vegetables."),
    ],
  },
  {
    id: "story-preparing-tea",
    title: "Preparing Morning Tea",
    description: "Watch the morning tea being prepared, step by step.",
    difficulty: "Easy",
    scene: "tea",
    icon: "Coffee",
    regionTags: ["Assam", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh"],
    interests: ["Tea", "Cooking", "Family"],
    scenes: [
      {
        image: "/images/story/tea-1.png",
        alt: "A kettle being prepared at the kitchen stove",
        narration: "Water is poured into the kettle in the morning.",
        caption: "Scene 1 — Filling the kettle",
        motion: "zoom-in",
        accent: { icon: "Droplet", label: "Water" },
      },
      {
        image: "/images/activities/tea.png",
        alt: "The kettle heating on the stove with steam",
        narration: "The water heats on the stove until it is ready.",
        caption: "Scene 2 — Heating the water",
        motion: "zoom-in",
        accent: { icon: "Flame", label: "Heating" },
      },
      {
        image: "/images/activities/tea.png",
        alt: "Tea leaves and ginger being added to the pot",
        narration: "Tea leaves and ginger are added to the pot.",
        caption: "Scene 3 — Adding tea and ginger",
        motion: "pan-right",
        accent: { icon: "Leaf", label: "Tea leaves" },
      },
      {
        image: "/images/story/tea-2.png",
        alt: "Tea being poured into a steel cup",
        narration: "The tea is poured into a steel cup.",
        caption: "Scene 4 — Pouring the tea",
        motion: "pan-down",
        accent: { icon: "CupSoda", label: "Pouring" },
      },
      {
        image: "/images/story/tea-3.png",
        alt: "The cup of tea placed on a table beside a brass lamp",
        narration: "The cup of tea is placed on the table, ready to be served.",
        caption: "Scene 5 — Tea is served",
        motion: "zoom-out",
        accent: { icon: "Heart", label: "Served" },
      },
    ],
    questions: [
      q("sequencing", "What happened first?", "Water was poured into the kettle", ["Tea was poured into a cup", "The tea was served", "Tea leaves were added"], "Filling the kettle with water was the first step."),
      q("sequencing", "What happened immediately before the tea was served?", "The tea was poured into a cup", ["Water was poured into the kettle", "The water heated on the stove", "Tea leaves were added"], "The tea was poured into a cup just before it was served."),
      q("sequencing", "What was added to the pot while the water heated?", "Tea leaves and ginger", ["Sugar and milk only", "Rice and spices", "Flowers and fruit"], "Tea leaves and ginger were added to the pot."),
      q("recall", "Where was the cup of tea placed at the end?", "On the table beside the brass lamp", ["On the stove", "In the garden", "On the shelf"], "The cup was placed on the table beside the brass lamp."),
    ],
  },
  {
    id: "story-morning-home",
    title: "A Morning at Home",
    description: "A quiet morning routine at home, with familiar objects.",
    difficulty: "Easy",
    scene: "home",
    icon: "Home",
    regionTags: [],
    interests: ["Family", "Stories"],
    scenes: [
      {
        image: "/images/activities/home.png",
        alt: "A quiet living room shelf in the morning light",
        narration: "The morning begins in the quiet living room.",
        caption: "Scene 1 — A quiet morning",
        motion: "zoom-in",
        accent: { icon: "Sunrise", label: "Morning" },
      },
      {
        image: "/images/activities/home.png",
        alt: "A brass lamp on the shelf",
        narration: "The brass lamp is noticed on the shelf.",
        caption: "Scene 2 — The brass lamp",
        motion: "pan-right",
        accent: { icon: "Lamp", label: "Brass lamp" },
      },
      {
        image: "/images/activities/home.png",
        alt: "A wooden photo frame on the shelf",
        narration: "A familiar photo frame sits beside it.",
        caption: "Scene 3 — The photo frame",
        motion: "zoom-in",
        accent: { icon: "Image", label: "Photo frame" },
      },
      {
        image: "/images/activities/home.png",
        alt: "Bananas on the table",
        narration: "On the table, there are three bananas.",
        caption: "Scene 4 — Bananas on the table",
        motion: "pan-down",
        accent: { icon: "Apple", label: "Bananas" },
      },
      {
        image: "/images/activities/home.png",
        alt: "A folded newspaper on the table",
        narration: "A folded newspaper rests near the bananas.",
        caption: "Scene 5 — The newspaper",
        motion: "zoom-out",
        accent: { icon: "Newspaper", label: "Newspaper" },
      },
    ],
    questions: [
      q("recall", "What was on the shelf?", "A brass lamp and a photo frame", ["A television and a radio", "A clock and a vase", "A book and a lamp"], "The brass lamp and the photo frame were on the shelf."),
      q("recall", "How many bananas were on the table?", "Three", ["Two", "Four", "Five"], "There were three bananas on the table."),
      q("spatial", "Where was the newspaper?", "On the table, near the bananas", ["On the shelf", "On the floor", "On the ceiling"], "The newspaper was on the table, near the bananas."),
      q("recall", "What was noticed first in the living room?", "The brass lamp on the shelf", ["The bananas on the table", "The newspaper", "The photo frame"], "The brass lamp on the shelf was noticed first."),
    ],
  },
  {
    id: "story-garden-visit",
    title: "A Visit to the Garden",
    description: "A calm morning in the home garden, among familiar flowers.",
    difficulty: "Moderate",
    scene: "garden",
    icon: "Flower2",
    regionTags: ["Assam", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh"],
    interests: ["Gardening", "Nature", "Birds"],
    scenes: [
      {
        image: "/images/activities/garden.png",
        alt: "A calm home garden in the morning light",
        narration: "The garden is calm in the morning light.",
        caption: "Scene 1 — Entering the garden",
        motion: "zoom-in",
        accent: { icon: "Sunrise", label: "Morning" },
      },
      {
        image: "/images/activities/garden.png",
        alt: "Red roses on the left side of the garden",
        narration: "Red roses are seen on the left side of the garden.",
        caption: "Scene 2 — The red roses",
        motion: "pan-left",
        accent: { icon: "Flower2", label: "Roses" },
      },
      {
        image: "/images/activities/garden.png",
        alt: "Orange marigolds in the garden",
        narration: "Orange marigolds bloom nearby.",
        caption: "Scene 3 — The marigolds",
        motion: "pan-right",
        accent: { icon: "Flower2", label: "Marigolds" },
      },
      {
        image: "/images/activities/garden.png",
        alt: "A steel watering can in the garden",
        narration: "A steel watering can rests on the ground.",
        caption: "Scene 4 — The watering can",
        motion: "zoom-in",
        accent: { icon: "Droplet", label: "Watering can" },
      },
      {
        image: "/images/activities/garden.png",
        alt: "A butterfly in the garden",
        narration: "A butterfly flutters past the flowers.",
        caption: "Scene 5 — A butterfly visits",
        motion: "pan-up",
        accent: { icon: "Bird", label: "Butterfly" },
      },
      {
        image: "/images/activities/garden.png",
        alt: "A bamboo basket in the garden",
        narration: "A small bamboo basket sits at the edge of the garden.",
        caption: "Scene 6 — The bamboo basket",
        motion: "zoom-out",
        accent: { icon: "ShoppingBasket", label: "Bamboo basket" },
      },
    ],
    questions: [
      q("recall", "What colour were the roses?", "Red", ["White", "Yellow", "Pink"], "The roses were red."),
      q("recall", "What colour were the marigolds?", "Orange", ["Blue", "Purple", "White"], "The marigolds were orange."),
      q("spatial", "Where was the watering can?", "On the ground", ["On the shelf", "On the ceiling", "In the tree"], "The watering can was on the ground."),
      q("recall", "What visited the garden near the end?", "A butterfly", ["A cat", "A dog", "A bird"], "A butterfly fluttered past the flowers."),
      q("recall", "What was at the edge of the garden?", "A bamboo basket", ["A steel chair", "A wooden ladder", "A glass table"], "A small bamboo basket sat at the edge of the garden."),
    ],
  },
  {
    id: "story-family-gathering",
    title: "A Family Gathering",
    description: "A warm afternoon in the community courtyard with family.",
    difficulty: "Moderate",
    scene: "community",
    icon: "Users",
    regionTags: ["Assam", "Karnataka", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh"],
    interests: ["Family", "Stories", "Festivals"],
    scenes: [
      {
        image: "/images/activities/community.png",
        alt: "A quiet community courtyard with a stone bench",
        narration: "The family gathers in the community courtyard.",
        caption: "Scene 1 — The courtyard",
        motion: "zoom-in",
        accent: { icon: "Home", label: "Courtyard" },
      },
      {
        image: "/images/activities/community.png",
        alt: "A large banyan tree over the stone bench",
        narration: "A large banyan tree shades the stone bench.",
        caption: "Scene 2 — Under the banyan tree",
        motion: "pan-up",
        accent: { icon: "TreePine", label: "Banyan tree" },
      },
      {
        image: "/images/activities/community.png",
        alt: "An elder and a child sitting on the bench",
        narration: "An elder and a child sit together on the bench.",
        caption: "Scene 3 — Together on the bench",
        motion: "zoom-in",
        accent: { icon: "Users", label: "Together" },
      },
      {
        image: "/images/activities/community.png",
        alt: "Two tea glasses on the bench",
        narration: "Two glasses of tea rest on the bench.",
        caption: "Scene 4 — Tea for everyone",
        motion: "pan-right",
        accent: { icon: "CupSoda", label: "Tea glasses" },
      },
      {
        image: "/images/activities/community.png",
        alt: "The courtyard in soft afternoon light",
        narration: "The afternoon passes gently in the courtyard.",
        caption: "Scene 5 — A calm afternoon",
        motion: "zoom-out",
        accent: { icon: "Heart", label: "Calm" },
      },
    ],
    questions: [
      q("recall", "Where did the family gather?", "In the community courtyard", ["In a restaurant", "In a garden", "In a temple"], "The family gathered in the community courtyard."),
      q("recall", "What tree shaded the bench?", "A banyan tree", ["A mango tree", "A coconut tree", "A pine tree"], "A large banyan tree shaded the stone bench."),
      q("recall", "Who sat on the bench together?", "An elder and a child", ["Two shopkeepers", "Three doctors", "A musician and a dancer"], "An elder and a child sat together on the bench."),
      q("recall", "How many glasses of tea were on the bench?", "Two", ["One", "Three", "Four"], "There were two glasses of tea on the bench."),
    ],
  },
];

export function storyGameById(id: string): StoryGame | undefined {
  return STORY_GAMES.find((s) => s.id === id);
}

/** Pick stories that match the elder's region and interests (with fallback to all). */
export function recommendedStories(regionState?: string, interests?: string[]): StoryGame[] {
  const all = STORY_GAMES;
  if (!regionState && !interests) return all;
  const matched = all.filter((s) => {
    const regionMatch = !s.regionTags.length || s.regionTags.includes(regionState || "");
    const interestMatch = !interests?.length || s.interests.some((i) => interests.includes(i));
    return regionMatch || interestMatch;
  });
  return matched.length ? matched : all;
}
