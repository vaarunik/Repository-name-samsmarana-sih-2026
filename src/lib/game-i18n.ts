// SAMSMARANA — activity/game content translations
//
// This extends the existing i18n system to cover ALL dynamically generated
// activity content: question prompts, answer options, feedback messages,
// instructions, puzzle prompts, pack-your-bags situations, etc.
//
// Architecture: the `t()` function in i18n.ts falls back to English → key,
// so missing translations simply show English. This file adds the ENGLISH
// keys that the game engines use as translation keys. The Kannada/Hindi/
// Tamil/Telugu dictionaries in i18n.ts already contain many of these keys;
// additional ones are added to those dictionaries in the same i18n.ts file.

import type { LanguageCode } from "./i18n";
import { t } from "./i18n";

/**
 * Translate a game-content string. If a translation exists for the current
 * language, it's returned. Otherwise the English string is returned (never
 * undefined/null/raw key).
 *
 * Usage in game engines:
 *   const prompt = gt(lang, "question.recognition.whichDidYouSee", { scene: "market" });
 */
export function gt(
  lang: LanguageCode,
  key: string,
  params?: Record<string, string | number>
): string {
  let text = t(lang, key);
  // Simple parameter substitution: {scene} → params.scene
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

/**
 * Get the English version of a translation key (for captions).
 */
export function gtEn(key: string, params?: Record<string, string | number>): string {
  return gt("en", key, params);
}

// ── English content keys used by game engines ──────────────────────
// These are the keys the game engines pass to gt(). The English values
// live in the `en` dictionary in i18n.ts. Other language dictionaries
// (kn, hi, ta, te) contain translations for these keys where available.

export const GAME_TEXT_KEYS = {
  // Activity instructions
  introInstruction: "game.introInstruction",
  observeInstruction: "game.observeInstruction",
  takeYourTime: "game.takeYourTime",
  lookCarefully: "game.lookCarefully",
  iveSeenIt: "game.iveSeenIt",

  // Question prompts
  recognitionWhichDidYouSee: "q.recognition.whichDidYouSee",
  recognitionWhichWasPart: "q.recognition.whichWasPart",
  recognitionWasShown: "q.recognition.wasShown",
  recognitionNotPart: "q.recognition.notPart",
  recallFirst: "q.recall.first",
  recallLast: "q.recall.last",
  recallMiddle: "q.recall.middle",
  attentionWhatColour: "q.attention.whatColour",
  attentionHowManyPeople: "q.attention.howManyPeople",
  countingHowMany: "q.counting.howMany",
  spatialWhereWas: "q.spatial.whereWas",
  sequencingAfter: "q.sequencing.after",
  concentrationWasShown: "q.concentration.wasShown",
  concentrationNotShown: "q.concentration.notShown",
  concentrationHowManyObjects: "q.concentration.howManyObjects",
  problemSolvingReach: "q.problemSolving.reach",
  languageDescribes: "q.language.describes",

  // Feedback
  wellDone: "feedback.wellDone",
  niceEffort: "feedback.niceEffort",
  thatsOkay: "feedback.thatsOkay",

  // Puzzle prompts
  puzzleWhichPicture: "puzzle.whichPicture",
  puzzleNotBelong: "puzzle.notBelong",
  puzzleArrange: "puzzle.arrange",
  puzzleNextPattern: "puzzle.nextPattern",
  puzzleHowMany: "puzzle.howMany",
  puzzleMissing: "puzzle.missing",
  puzzleStudyPattern: "puzzle.studyPattern",
  puzzleMemorize: "puzzle.memorize",
  puzzleClickOrder: "puzzle.clickOrder",

  // Pack Your Bags
  packStartPacking: "pack.startPacking",
  packYourBag: "pack.yourBag",
  packHint: "pack.hint",
  packDonePacking: "pack.donePacking",
  packDidWeForget: "pack.didWeForget",
  packAlreadyInBag: "pack.alreadyInBag",
  packWhichForgot: "pack.whichForgot",

  // Game UI
  startPuzzles: "game.startPuzzles",
  startGame: "game.startGame",
  finishGame: "game.finishGame",
  scoreLabel: "game.score",
  applesLabel: "game.apples",
  movesLabel: "game.moves",
  pairsLabel: "game.pairs",
  roundLabel: "game.round",
  levelLabel: "game.level",
} as const;
