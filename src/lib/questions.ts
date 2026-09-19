// SAMSMARANA — cognitive question bank
// Each scene has a "content pack" describing what is actually shown,
// so that the questions are answerable and consistent with the Veo
// prompt (which is built from the same pack). Questions cover all
// active cognitive categories.

import type { ActivityCategory, Question, SceneKey } from "./types";

interface ContentPack {
  objects: string[]; // ordered by appearance
  counts: Record<string, number>;
  colors: Record<string, string>;
  positions: Record<string, string>;
  people?: number;
  first: string;
  last: string;
}

const PACKS: Record<SceneKey, ContentPack> = {
  garden: {
    objects: ["rose", "marigold", "watering can", "bamboo basket", "butterfly"],
    counts: { rose: 3, marigold: 5, butterfly: 2 },
    colors: { rose: "red", marigold: "orange", basket: "brown" },
    positions: { "watering can": "on the left", "bamboo basket": "on the right" },
    first: "rose",
    last: "butterfly",
  },
  market: {
    objects: ["tomato", "spinach", "pumpkin", "woven basket", "shopkeeper"],
    counts: { tomato: 6, pumpkin: 2, basket: 3 },
    colors: { tomato: "red", pumpkin: "green", shopkeeper: "blue" },
    positions: { tomato: "on the left of the stall", pumpkin: "on the right" },
    people: 1,
    first: "tomato",
    last: "shopkeeper",
  },
  shop: {
    objects: ["glass jar", "rice bag", "tin of tea", "notebook", "shopkeeper"],
    counts: { "glass jar": 4, "rice bag": 2, "tin of tea": 3 },
    colors: { "rice bag": "white", "tin of tea": "green" },
    positions: { "glass jar": "on the top shelf", "rice bag": "on the floor" },
    people: 1,
    first: "glass jar",
    last: "notebook",
  },
  cooking: {
    objects: ["pot", "rice", "spoon", "mustard seeds", "curry leaf"],
    counts: { pot: 1, spoon: 2, "curry leaf": 4 },
    colors: { pot: "black", spoon: "steel" },
    positions: { pot: "on the stove", spoon: "beside the pot" },
    first: "pot",
    last: "curry leaf",
  },
  tea: {
    objects: ["steel tumbler", "tea leaves", "milk", "ginger", "sugar"],
    counts: { "steel tumbler": 2, ginger: 3 },
    colors: { "steel tumbler": "silver", milk: "white" },
    positions: { "steel tumbler": "on the right", ginger: "in the pot" },
    first: "steel tumbler",
    last: "sugar",
  },
  train: {
    objects: ["window", "green field", "passenger", "tea vendor", "river"],
    counts: { passenger: 2, "tea vendor": 1 },
    colors: { field: "green", river: "blue" },
    positions: { field: "outside the window", "tea vendor": "in the aisle" },
    people: 3,
    first: "window",
    last: "river",
  },
  nature: {
    objects: ["hill", "tree", "stream", "cloud", "bird"],
    counts: { tree: 4, bird: 2, cloud: 3 },
    colors: { hill: "green", stream: "blue" },
    positions: { hill: "in the distance", stream: "in the foreground" },
    first: "hill",
    last: "bird",
  },
  birds: {
    objects: ["sparrow", "parrot", "myna", "feeder", "branch"],
    counts: { sparrow: 3, parrot: 2, myna: 1 },
    colors: { parrot: "green", sparrow: "brown" },
    positions: { feeder: "on the ground", branch: "above the feeder" },
    first: "sparrow",
    last: "branch",
  },
  home: {
    objects: ["brass lamp", "photo frame", "steel glass", "banana", "newspaper"],
    counts: { "steel glass": 2, banana: 3 },
    colors: { lamp: "brass", "photo frame": "brown" },
    positions: { lamp: "on the shelf", newspaper: "on the table" },
    first: "brass lamp",
    last: "newspaper",
  },
  community: {
    objects: ["stone bench", "banyan tree", "elder", "child", "tea glass"],
    counts: { "tea glass": 2, elder: 1, child: 1 },
    colors: { "tea glass": "glass", "banyan tree": "green" },
    positions: { "stone bench": "under the tree", "tea glass": "on the bench" },
    people: 2,
    first: "stone bench",
    last: "tea glass",
  },
  river: {
    objects: ["boat", "fisherman", "net", "heron", "morning mist"],
    counts: { boat: 1, heron: 2, fisherman: 1 },
    colors: { boat: "wooden", heron: "white" },
    positions: { boat: "near the bank", heron: "at the water's edge" },
    people: 1,
    first: "boat",
    last: "morning mist",
  },
  festival: {
    objects: ["diya", "rangoli", "sweet box", "flower garland", "banana leaf"],
    counts: { diya: 4, "sweet box": 2 },
    colors: { rangoli: "colourful", diya: "golden" },
    positions: { rangoli: "at the doorstep", diya: "around the rangoli" },
    first: "diya",
    last: "banana leaf",
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a multiple-choice question. `correct` is always one of the options;
 * the helper shuffles all options and records the correct index after
 * shuffling so the marked answer is always right.
 */
function mc(
  skill: ActivityCategory,
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

/** Build a focused set of cognitive questions for a scene + category. */
export function buildQuestions(
  scene: SceneKey,
  category: ActivityCategory,
  difficulty: number
): Question[] {
  const pack = PACKS[scene];
  const objs = pack.objects;
  const wrongsFrom = (exclude: string[]) =>
    objs.filter((o) => !exclude.includes(o));
  const out: Question[] = [];

  switch (category) {
    case "recognition": {
      const target = objs[0];
      out.push(
        mc(
          "recognition",
          `Which of these did you see in the ${sceneLabel(scene)}?`,
          target,
          shuffle(wrongsFrom([target])).slice(0, 3),
          `The ${target} was clearly shown in the scene.`
        )
      );
      if (difficulty >= 2) {
        const target2 = objs[2];
        out.push(
          mc(
            "recognition",
            `Which object was NOT part of the scene?`,
            "a space rocket",
            shuffle(wrongsFrom([target2])).slice(0, 3),
            `A space rocket was not shown — everything else appeared in the scene.`
          )
        );
      }
      break;
    }
    case "recall": {
      out.push(
        mc(
          "recall",
          `Which object appeared FIRST in the scene?`,
          pack.first,
          shuffle(wrongsFrom([pack.first])).slice(0, 3),
          `The ${pack.first} appeared first.`
        )
      );
      if (difficulty >= 3) {
        out.push(
          mc(
            "recall",
            `Which object appeared LAST in the scene?`,
            pack.last,
            shuffle(wrongsFrom([pack.last])).slice(0, 3),
            `The ${pack.last} appeared last.`
          )
        );
      }
      break;
    }
    case "attention": {
      const [cObj, cCol] = Object.entries(pack.colors)[0];
      out.push(
        mc(
          "attention",
          `What colour was the ${cObj}?`,
          cCol,
          shuffle(["yellow", "purple", "pink"].filter((c) => c !== cCol)),
          `The ${cObj} was ${cCol}.`
        )
      );
      if (difficulty >= 2 && pack.people) {
        out.push(
          mc(
            "attention",
            `How many people did you see in the scene?`,
            String(pack.people),
            shuffle([String(pack.people + 1), String(pack.people + 2), String(Math.max(0, pack.people - 1))]),
            `There ${pack.people === 1 ? "was 1 person" : `were ${pack.people} people`} in the scene.`
          )
        );
      }
      break;
    }
    case "counting": {
      const [cObj, cCount] = Object.entries(pack.counts)[0];
      out.push(
        mc(
          "counting",
          `How many ${cObj}${cObj.endsWith("s") ? "" : "s"} did you see?`,
          String(cCount),
          shuffle([
            String(cCount + 1),
            String(Math.max(0, cCount - 1)),
            String(cCount + 2),
          ]),
          `There ${cCount === 1 ? "was 1" : `were ${cCount}`} ${cObj} in the scene.`
        )
      );
      if (difficulty >= 3) {
        const entries = Object.entries(pack.counts);
        if (entries[1]) {
          const [cObj2, cCount2] = entries[1];
          out.push(
            mc(
              "counting",
              `How many ${cObj2} were there?`,
              String(cCount2),
              shuffle([String(cCount2 + 1), String(cCount2 + 2), String(Math.max(0, cCount2 - 1))]),
              `There were ${cCount2} ${cObj2} in the scene.`
            )
          );
        }
      }
      break;
    }
    case "spatial": {
      const [sObj, sPos] = Object.entries(pack.positions)[0];
      out.push(
        mc(
          "spatial",
          `Where was the ${sObj}?`,
          sPos,
          shuffle(["in the centre", "on the ceiling", "under the table"].filter((p) => p !== sPos)),
          `The ${sObj} was ${sPos}.`
        )
      );
      if (difficulty >= 3) {
        const entries = Object.entries(pack.positions);
        if (entries[1]) {
          const [sObj2, sPos2] = entries[1];
          out.push(
            mc(
              "spatial",
              `Where was the ${sObj2}?`,
              sPos2,
              shuffle([sPos, "in the centre"].filter((p) => p !== sPos2)),
              `The ${sObj2} was ${sPos2}.`
            )
          );
        }
      }
      break;
    }
    case "sequencing": {
      const seq = objs.slice(0, Math.min(3, objs.length));
      out.push(
        mc(
          "sequencing",
          `Which object came right AFTER the ${seq[0]}?`,
          seq[1],
          shuffle(objs.filter((o) => o !== seq[1])).slice(0, 3),
          `After the ${seq[0]}, the ${seq[1]} appeared.`
        )
      );
      break;
    }
    case "concentration": {
      out.push(
        mc(
          "concentration",
          `Was a ${pack.first} shown in the scene?`,
          "Yes",
          ["No"],
          `Yes — the ${pack.first} was shown.`
        )
      );
      out.push(
        mc(
          "concentration",
          `How many different objects appeared?`,
          String(objs.length),
          shuffle([String(objs.length - 1), String(objs.length + 1)]),
          `${objs.length} different objects appeared in the scene.`
        )
      );
      break;
    }
    case "problem_solving": {
      const [pObj] = Object.entries(pack.positions)[0];
      out.push(
        mc(
          "problem_solving",
          `If you needed the ${pObj} but could not reach it safely, what is the best next step?`,
          "Ask someone for help",
          ["Climb the shelves quickly", "Pull the shelf toward you", "Jump and grab it"],
          `Asking for help is the safest choice — climbing or pulling shelves risks a fall.`
        )
      );
      break;
    }
    case "language": {
      const word = pack.first;
      out.push(
        mc(
          "language",
          `Which phrase best describes "${word}"?`,
          "a familiar everyday thing",
          ["a distant planet", "a type of storm", "a musical note"],
          `"${word}" is a familiar everyday thing shown in the scene.`
        )
      );
      break;
    }
  }

  return out;
}

/** Return the objects that appear in a scene (for the memorize step). */
export function sceneObjects(scene: SceneKey): string[] {
  return [...(PACKS[scene]?.objects ?? [])];
}

function sceneLabel(scene: SceneKey): string {
  const map: Record<SceneKey, string> = {
    garden: "garden",
    market: "market",
    shop: "shop",
    cooking: "kitchen",
    tea: "tea scene",
    train: "train",
    nature: "landscape",
    birds: "garden",
    home: "home",
    community: "courtyard",
    river: "river scene",
    festival: "festival scene",
  };
  return map[scene];
}
