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
    situation: "pack.situation.beach",
    situationCaption: "",
    hint: "pack.hint.beach",
    hintCaption: "Think about sun, water, and sand.",
    items: [
      { id: "sunglasses", label: "pack.item.sunglasses", icon: "Glasses", correct: true },
      { id: "towel", label: "pack.item.towel", icon: "Package", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "slippers", label: "pack.item.slippers", icon: "Footprints", correct: true },
      { id: "sweater", label: "pack.item.sweater", icon: "Shirt", correct: false },
      { id: "blanket", label: "pack.item.blanket", icon: "BedDouble", correct: false },
      { id: "umbrella", label: "pack.item.umbrella", icon: "Umbrella", correct: false },
    ],
  },
  {
    id: "rainy",
    situation: "pack.situation.rainy",
    situationCaption: "",
    hint: "pack.hint.rainy",
    hintCaption: "Think about rain, wet clothes, and staying dry.",
    items: [
      { id: "umbrella", label: "pack.item.umbrella", icon: "Umbrella", correct: true },
      { id: "raincoat", label: "pack.item.raincoat", icon: "Shirt", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "shawl", label: "pack.item.shawl", icon: "Hand", correct: true },
      { id: "sunglasses", label: "pack.item.sunglasses", icon: "Glasses", correct: false },
      { id: "beachball", label: "pack.item.beachball", icon: "Circle", correct: false },
      { id: "fan", label: "pack.item.fan", icon: "Wind", correct: false },
    ],
  },
  {
    id: "temple",
    situation: "pack.situation.temple",
    situationCaption: "",
    hint: "pack.hint.temple",
    hintCaption: "Think about prayer, flowers, and respect.",
    items: [
      { id: "flowers", label: "pack.item.flowers", icon: "Flower2", correct: true },
      { id: "fruits", label: "pack.item.fruits", icon: "Apple", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "phone", label: "pack.item.phone", icon: "Smartphone", correct: false },
      { id: "shoes", label: "pack.item.shoes", icon: "Footprints", correct: false },
      { id: "hat", label: "pack.item.hat", icon: "Glasses", correct: false },
    ],
  },
  {
    id: "hospital",
    situation: "pack.situation.hospital",
    situationCaption: "",
    hint: "pack.hint.hospital",
    hintCaption: "Think about health, documents, and waiting.",
    items: [
      { id: "medicines", label: "pack.item.medicines", icon: "Package", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "phone", label: "pack.item.phone", icon: "Smartphone", correct: true },
      { id: "wallet", label: "pack.item.wallet", icon: "Wallet", correct: true },
      { id: "beachball", label: "pack.item.beachball", icon: "Circle", correct: false },
      { id: "hat", label: "pack.item.hat", icon: "Glasses", correct: false },
      { id: "toys", label: "pack.item.toys", icon: "Gamepad2", correct: false },
    ],
  },
  {
    id: "picnic",
    situation: "pack.situation.picnic",
    situationCaption: "",
    hint: "pack.hint.picnic",
    hintCaption: "Think about food, sitting outside, and enjoying nature.",
    items: [
      { id: "lunchbox", label: "pack.item.lunchbox", icon: "Utensils", correct: true },
      { id: "towel", label: "pack.item.towel", icon: "Package", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "hat", label: "pack.item.hat", icon: "Glasses", correct: true },
      { id: "umbrella", label: "pack.item.umbrella", icon: "Umbrella", correct: false },
      { id: "sweater", label: "pack.item.sweater", icon: "Shirt", correct: false },
      { id: "blanket", label: "pack.item.blanket", icon: "BedDouble", correct: false },
    ],
  },
  {
    id: "shopping",
    situation: "pack.situation.shopping",
    situationCaption: "",
    hint: "pack.hint.shopping",
    hintCaption: "Think about money, carrying things, and your essentials.",
    items: [
      { id: "wallet", label: "pack.item.wallet", icon: "Wallet", correct: true },
      { id: "bag", label: "pack.item.bag", icon: "ShoppingBag", correct: true },
      { id: "phone", label: "pack.item.phone", icon: "Smartphone", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "beachball", label: "pack.item.beachball", icon: "Circle", correct: false },
      { id: "toys", label: "pack.item.toys", icon: "Gamepad2", correct: false },
      { id: "fan", label: "pack.item.fan", icon: "Wind", correct: false },
    ],
  },
  {
    id: "family",
    situation: "pack.situation.family",
    situationCaption: "",
    hint: "pack.hint.family",
    hintCaption: "Think about staying the night — clothes, essentials, and a gift.",
    items: [
      { id: "clothes", label: "pack.item.clothes", icon: "Shirt", correct: true },
      { id: "medicines", label: "pack.item.medicines", icon: "Package", correct: true },
      { id: "phone", label: "pack.item.phone", icon: "Smartphone", correct: true },
      { id: "fruits", label: "pack.item.fruits", icon: "Apple", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "beachball", label: "pack.item.beachball", icon: "Circle", correct: false },
      { id: "umbrella", label: "pack.item.umbrella", icon: "Umbrella", correct: false },
      { id: "hat", label: "pack.item.hat", icon: "Glasses", correct: false },
    ],
  },
  {
    id: "park",
    situation: "pack.situation.park",
    situationCaption: "",
    hint: "pack.hint.park",
    hintCaption: "Think about walking, sitting, and the outdoors.",
    items: [
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "hat", label: "pack.item.hat", icon: "Glasses", correct: true },
      { id: "slippers", label: "pack.item.slippers", icon: "Footprints", correct: true },
      { id: "blanket", label: "pack.item.blanket", icon: "BedDouble", correct: false },
      { id: "sweater", label: "pack.item.sweater", icon: "Shirt", correct: false },
      { id: "toys", label: "pack.item.toys", icon: "Gamepad2", correct: false },
    ],
  },
  {
    id: "trip",
    situation: "pack.situation.trip",
    situationCaption: "",
    hint: "pack.hint.trip",
    hintCaption: "Think about travel, staying somewhere, and your essentials.",
    items: [
      { id: "clothes", label: "pack.item.clothes", icon: "Shirt", correct: true },
      { id: "medicines", label: "pack.item.medicines", icon: "Package", correct: true },
      { id: "phone", label: "pack.item.phone", icon: "Smartphone", correct: true },
      { id: "wallet", label: "pack.item.wallet", icon: "Wallet", correct: true },
      { id: "water", label: "pack.item.water", icon: "CupSoda", correct: true },
      { id: "beachball", label: "pack.item.beachball", icon: "Circle", correct: false },
      { id: "fan", label: "pack.item.fan", icon: "Wind", correct: false },
      { id: "toys", label: "pack.item.toys", icon: "Gamepad2", correct: false },
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
      prompt: "pack.didWeForget",
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
