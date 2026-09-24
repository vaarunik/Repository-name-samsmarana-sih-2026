// SAMSMARANA — "Pack Your Bags" game data
// Everyday situation-based cognitive game. The player selects which objects
// to pack for a given destination/situation, then completes a "Did we forget
// anything?" recall stage. Uses adaptive difficulty + content rotation.

export interface PackItem {
  id: string;
  label: string;
  icon: string; // lucide icon name
  correct: boolean; // should this be packed for the situation?
}

export interface PackScenario {
  id: string;
  situation: string;
  situationCaption: string; // English caption for multilingual
  items: PackItem[];
  hint: string;
  hintCaption: string;
}

// ── Scenario pool — each has correct + distractor items ────────────
export const PACK_SCENARIOS: PackScenario[] = [
  {
    id: "beach",
    situation: "You are going to the beach. What should you pack?",
    situationCaption: "You are going to the beach. What should you pack?",
    hint: "Think about sun, water, and sand.",
    hintCaption: "Think about sun, water, and sand.",
    items: [
      { id: "sunglasses", label: "Sunglasses", icon: "Glasses", correct: true },
      { id: "towel", label: "Towel", icon: "Package", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "slippers", label: "Slippers", icon: "Footprints", correct: true },
      { id: "sweater", label: "Woollen sweater", icon: "Shirt", correct: false },
      { id: "blanket", label: "Heavy blanket", icon: "BedDouble", correct: false },
      { id: "umbrella", label: "Umbrella", icon: "Umbrella", correct: false },
    ],
  },
  {
    id: "rainy",
    situation: "You are going outside on a rainy day. What should you pack?",
    situationCaption: "You are going outside on a rainy day. What should you pack?",
    hint: "Think about rain, wet clothes, and staying dry.",
    hintCaption: "Think about rain, wet clothes, and staying dry.",
    items: [
      { id: "umbrella", label: "Umbrella", icon: "Umbrella", correct: true },
      { id: "raincoat", label: "Raincoat", icon: "Shirt", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "shawl", label: "Shawl", icon: "Hand", correct: true },
      { id: "sunglasses", label: "Sunglasses", icon: "Glasses", correct: false },
      { id: "beachball", label: "Beach ball", icon: "Circle", correct: false },
      { id: "fan", label: "Hand fan", icon: "Wind", correct: false },
    ],
  },
  {
    id: "temple",
    situation: "You are going to a temple. What should you take?",
    situationCaption: "You are going to a temple. What should you take?",
    hint: "Think about prayer, flowers, and respect.",
    hintCaption: "Think about prayer, flowers, and respect.",
    items: [
      { id: "flowers", label: "Flowers", icon: "Flower2", correct: true },
      { id: "fruits", label: "Fruits", icon: "Apple", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "phone", label: "Phone", icon: "Smartphone", correct: false },
      { id: "shoes", label: "Shoes", icon: "Footprints", correct: false },
      { id: "hat", label: "Hat", icon: "Glasses", correct: false },
    ],
  },
  {
    id: "hospital",
    situation: "You are going to the hospital. What should you take?",
    situationCaption: "You are going to the hospital. What should you take?",
    hint: "Think about health, documents, and waiting.",
    hintCaption: "Think about health, documents, and waiting.",
    items: [
      { id: "medicines", label: "Medicines", icon: "Package", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "phone", label: "Phone", icon: "Smartphone", correct: true },
      { id: "wallet", label: "Wallet", icon: "Wallet", correct: true },
      { id: "beachball", label: "Beach ball", icon: "Circle", correct: false },
      { id: "hat", label: "Hat", icon: "Glasses", correct: false },
      { id: "toys", label: "Toys", icon: "Gamepad2", correct: false },
    ],
  },
  {
    id: "picnic",
    situation: "You are going for a picnic. What should you pack?",
    situationCaption: "You are going for a picnic. What should you pack?",
    hint: "Think about food, sitting outside, and enjoying nature.",
    hintCaption: "Think about food, sitting outside, and enjoying nature.",
    items: [
      { id: "lunchbox", label: "Lunch box", icon: "Utensils", correct: true },
      { id: "towel", label: "Towel", icon: "Package", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "hat", label: "Hat", icon: "Glasses", correct: true },
      { id: "umbrella", label: "Umbrella", icon: "Umbrella", correct: false },
      { id: "sweater", label: "Woollen sweater", icon: "Shirt", correct: false },
      { id: "blanket", label: "Heavy blanket", icon: "BedDouble", correct: false },
    ],
  },
  {
    id: "shopping",
    situation: "You are going shopping. What should you take?",
    situationCaption: "You are going shopping. What should you take?",
    hint: "Think about money, carrying things, and your essentials.",
    hintCaption: "Think about money, carrying things, and your essentials.",
    items: [
      { id: "wallet", label: "Wallet", icon: "Wallet", correct: true },
      { id: "bag", label: "Shopping bag", icon: "ShoppingBag", correct: true },
      { id: "phone", label: "Phone", icon: "Smartphone", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "beachball", label: "Beach ball", icon: "Circle", correct: false },
      { id: "toys", label: "Toys", icon: "Gamepad2", correct: false },
      { id: "fan", label: "Hand fan", icon: "Wind", correct: false },
    ],
  },
  {
    id: "family",
    situation: "You are visiting family overnight. What should you pack?",
    situationCaption: "You are visiting family overnight. What should you pack?",
    hint: "Think about staying the night — clothes, essentials, and a gift.",
    hintCaption: "Think about staying the night — clothes, essentials, and a gift.",
    items: [
      { id: "clothes", label: "Clothes", icon: "Shirt", correct: true },
      { id: "medicines", label: "Medicines", icon: "Package", correct: true },
      { id: "phone", label: "Phone", icon: "Smartphone", correct: true },
      { id: "fruits", label: "Fruits", icon: "Apple", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "beachball", label: "Beach ball", icon: "Circle", correct: false },
      { id: "umbrella", label: "Umbrella", icon: "Umbrella", correct: false },
      { id: "hat", label: "Sun hat", icon: "Glasses", correct: false },
    ],
  },
  {
    id: "park",
    situation: "You are going to the park. What should you take?",
    situationCaption: "You are going to the park. What should you take?",
    hint: "Think about walking, sitting, and the outdoors.",
    hintCaption: "Think about walking, sitting, and the outdoors.",
    items: [
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "hat", label: "Hat", icon: "Glasses", correct: true },
      { id: "slippers", label: "Slippers", icon: "Footprints", correct: true },
      { id: "blanket", label: "Heavy blanket", icon: "BedDouble", correct: false },
      { id: "sweater", label: "Woollen sweater", icon: "Shirt", correct: false },
      { id: "toys", label: "Toys", icon: "Gamepad2", correct: false },
    ],
  },
  {
    id: "trip",
    situation: "You are going on a short trip. What should you pack?",
    situationCaption: "You are going on a short trip. What should you pack?",
    hint: "Think about travel, staying somewhere, and your essentials.",
    hintCaption: "Think about travel, staying somewhere, and your essentials.",
    items: [
      { id: "clothes", label: "Clothes", icon: "Shirt", correct: true },
      { id: "medicines", label: "Medicines", icon: "Package", correct: true },
      { id: "phone", label: "Phone", icon: "Smartphone", correct: true },
      { id: "wallet", label: "Wallet", icon: "Wallet", correct: true },
      { id: "water", label: "Water bottle", icon: "CupSoda", correct: true },
      { id: "beachball", label: "Beach ball", icon: "Circle", correct: false },
      { id: "fan", label: "Hand fan", icon: "Wind", correct: false },
      { id: "toys", label: "Toys", icon: "Gamepad2", correct: false },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface PackRound {
  scenario: PackScenario;
  /** items to display this round (subset based on difficulty) */
  items: PackItem[];
  /** the "Did we forget?" missing-item question */
  missingItemQuestion: {
    prompt: string;
    promptCaption: string;
    options: PackItem[];
    correctId: string;
  };
}

/**
 * Build a Pack Your Bags round with adaptive difficulty.
 * Difficulty 1-2 (easy): 3 correct + 2-3 distractors
 * Difficulty 3 (medium): 4-5 correct + 3-4 distractors
 * Difficulty 4-5 (advanced): 5-6 correct + 4+ distractors
 */
export function buildPackRound(difficulty: number, recentScenarioIds: string[] = []): PackRound {
  // Pick a scenario not recently used
  const available = PACK_SCENARIOS.filter((s) => !recentScenarioIds.includes(s.id));
  const pool = available.length > 0 ? available : PACK_SCENARIOS;
  const scenario = pool[Math.floor(Math.random() * pool.length)];

  const correctItems = shuffle(scenario.items.filter((i) => i.correct));
  const distractors = shuffle(scenario.items.filter((i) => !i.correct));

  // Determine counts based on difficulty
  let correctCount: number;
  let distractorCount: number;

  if (difficulty <= 2) {
    correctCount = Math.min(3, correctItems.length);
    distractorCount = Math.min(2 + Math.floor(difficulty / 2), distractors.length);
  } else if (difficulty <= 3) {
    correctCount = Math.min(4, correctItems.length);
    distractorCount = Math.min(3, distractors.length);
  } else {
    correctCount = Math.min(5, correctItems.length);
    distractorCount = Math.min(4, distractors.length);
  }

  const selectedCorrect = correctItems.slice(0, correctCount);
  const selectedDistractors = distractors.slice(0, distractorCount);
  const displayItems = shuffle([...selectedCorrect, ...selectedDistractors]);

  // Build the "Did we forget?" question:
  // Show the correct items that WERE packed + 1 correct item that was NOT shown + distractors
  const allCorrect = scenario.items.filter((i) => i.correct);
  const notShownCorrect = allCorrect.filter((i) => !selectedCorrect.includes(i));
  const missingCorrect = notShownCorrect[0] ?? selectedCorrect[0];
  const missingOptions = shuffle([
    missingCorrect,
    ...shuffle(distractors).slice(0, 3),
  ]);

  return {
    scenario,
    items: displayItems,
    missingItemQuestion: {
      prompt: `Your bag is ready for the ${scenario.id === "beach" ? "beach" : scenario.id === "rainy" ? "rainy day" : scenario.id === "temple" ? "temple" : scenario.id === "hospital" ? "hospital" : scenario.id === "picnic" ? "picnic" : scenario.id === "shopping" ? "shopping" : scenario.id === "family" ? "family visit" : scenario.id === "park" ? "park" : "trip"}. Did we forget anything?`,
      promptCaption: `Your bag is ready! Did we forget anything?`,
      options: missingOptions,
      correctId: missingCorrect.id,
    },
  };
}

export function adaptiveDifficulty(currentDifficulty: number, accuracy: number): number {
  if (accuracy >= 0.8 && currentDifficulty < 5) return currentDifficulty + 1;
  if (accuracy < 0.4 && currentDifficulty > 1) return currentDifficulty - 1;
  return currentDifficulty;
}
