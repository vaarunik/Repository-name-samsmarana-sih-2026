"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, RotateCw, Trophy, Briefcase, Check, X, Lightbulb, Package,
  Glasses, CupSoda, Footprints, Shirt, BedDouble, Umbrella,
  Circle, Wind, Flower2, Apple, Smartphone, Wallet, ShoppingBag,
  Utensils, Gamepad2, Hand, Watch, Camera, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "./BackButton";
import { VoiceSpeedControl, ListenButton } from "./VoiceControls";
import { useVoiceSpeed } from "@/lib/voice";
import { useT, useTC } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { recordAttempt } from "@/lib/sync";
import { buildPackRound, adaptiveDifficulty, type PackRound, type PackItem } from "@/lib/pack-data";
import { motion, AnimatePresence } from "framer-motion";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Glasses, CupSoda, Footprints, Shirt, BedDouble, Umbrella,
  Circle, Wind, Flower2, Apple, Smartphone, Wallet, ShoppingBag,
  Utensils, Gamepad2, Hand, Watch, Camera, BookOpen, Package,
};

type Phase = "intro" | "packing" | "recall" | "feedback" | "complete";

export function PackYourBagsGame({ onExit }: { onExit: () => void }) {
  const profile = useApp((s) => s.profile);
  const [speed, setSpeed] = useVoiceSpeed();
  const t = useT();
  const tc = useTC();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState(2);
  const [round, setRound] = useState<PackRound | null>(null);
  const [packed, setPacked] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [totalRounds] = useState(3);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [recallAnswer, setRecallAnswer] = useState<string | null>(null);
  const [recentScenarios, setRecentScenarios] = useState<string[]>([]);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); };
  }, []);

  function startGame() {
    setScore(0);
    setRoundNum(0);
    setHintsUsed(0);
    setRecentScenarios([]);
    nextRound(2, []);
  }

  function nextRound(diff: number, recent: string[]) {
    const r = buildPackRound(diff, recent);
    setRound(r);
    setPacked(new Set());
    setShowHint(false);
    setFeedback(null);
    setRecallAnswer(null);
    setPhase("packing");
    setRecentScenarios((prev) => [...prev, r.scenario.id].slice(-4));
  }

  function togglePack(item: PackItem) {
    const newPacked = new Set(packed);
    if (newPacked.has(item.id)) {
      newPacked.delete(item.id);
    } else {
      newPacked.add(item.id);
    }
    setPacked(newPacked);
  }

  function confirmPacking() {
    // Score: +1 for each correct pack, -0 for incorrect (dementia-friendly: no harsh penalty)
    const correctPacked = round!.items.filter((i) => i.correct && packed.has(i.id)).length;
    const incorrectPacked = round!.items.filter((i) => !i.correct && packed.has(i.id)).length;
    const totalCorrect = round!.items.filter((i) => i.correct).length;
    const accuracy = totalCorrect > 0 ? correctPacked / totalCorrect : 0;
    const roundScore = Math.max(0, correctPacked * 10 - incorrectPacked * 3);

    setScore((s) => s + roundScore);

    if (incorrectPacked > 0) {
      setFeedback({
        correct: false,
        message: `Good try! You packed ${correctPacked} correct items. Let's think about the others — would you need them for this trip?`,
      });
    } else if (correctPacked === totalCorrect) {
      setFeedback({
        correct: true,
        message: `Excellent! You packed all the right items!`,
      });
    } else {
      setFeedback({
        correct: true,
        message: `Good choices! You packed ${correctPacked} out of ${totalCorrect} needed items.`,
      });
    }
    setPhase("recall");
  }

  function answerRecall(itemId: string) {
    setRecallAnswer(itemId);
    const isCorrect = itemId === round!.missingItemQuestion.correctId;
    const correctItem = round!.missingItemQuestion.options.find((o) => o.id === round!.missingItemQuestion.correctId);
    if (isCorrect) {
      setScore((s) => s + 15);
      setFeedback({ correct: true, message: `Well done! You remembered the ${correctItem?.label}.` });
    } else {
      setFeedback({ correct: false, message: `The ${correctItem?.label} would have been useful too. Let's try the next one!` });
    }
    setPhase("feedback");
    feedbackTimer.current = setTimeout(() => {
      const nextNum = roundNum + 1;
      setRoundNum(nextNum);
      if (nextNum < totalRounds) {
        const totalCorrect = round!.items.filter((i) => i.correct).length;
        const correctPacked = round!.items.filter((i) => i.correct && packed.has(i.id)).length;
        const acc = totalCorrect > 0 ? correctPacked / totalCorrect : 0;
        const recallAcc = isCorrect ? 1 : 0;
        const combinedAcc = (acc + recallAcc) / 2;
        const newDiff = adaptiveDifficulty(difficulty, combinedAcc);
        setDifficulty(newDiff);
        nextRound(newDiff, [...recentScenarios, round!.scenario.id]);
      } else {
        finish();
      }
    }, 2500);
  }

  async function finish() {
    const accuracy = score / (totalRounds * 50); // approximate
    recordAttempt({
      id: crypto.randomUUID(),
      profileId: profile?.id ?? "anon",
      activityId: "pack-your-bags",
      category: "problem_solving",
      title: t("pack.startPacking"),
      difficulty,
      accuracy: Math.min(accuracy, 1),
      responseMs: 0,
      completed: true,
      skipped: false,
      score,
      syncState: "synced",
      syncId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }).catch(() => {});
    setPhase("complete");
  }

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white">
            <Badge className="bg-white/20 text-white">Cognitive Game</Badge>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Pack Your Bags</h2>
            <p className="mt-1 text-white/85">Choose the right items to pack for different everyday situations. Then test your memory — did you forget anything?</p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">Level {difficulty}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{totalRounds} rounds</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">Adaptive</span>
            </div>
            <Button size="lg" className="mt-6 h-14 min-w-[160px] gap-2.5 rounded-2xl bg-primary text-base font-semibold text-primary-foreground" onClick={startGame}>
              <Briefcase className="h-5 w-5" /> Start packing <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  // ── PACKING ──
  if (phase === "packing" && round) {
    const packedCount = packed.size;
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-base font-medium text-foreground">Round {roundNum + 1} of {totalRounds}</span>
          <span className="text-sm text-muted-foreground">Score: {score}</span>
        </div>
        <Progress value={((roundNum + 1) / totalRounds) * 100} className="mb-4 h-2.5" />

        {/* Situation */}
        <Card className="mb-4 bg-emerald-50/60 p-5">
          <p className="text-lg font-semibold text-foreground">{t(round.scenario.situation)}</p>
          {(profile?.language ?? "en") !== "en" && (
            <p className="mt-1 text-xs text-muted-foreground">{t("en" as never) && round.scenario.situation.startsWith("pack.") ? t(round.scenario.situation) : round.scenario.situation}</p>
          )}
          <div className="mt-3">
            <ListenButton text={t(round.scenario.situation)} lang={(profile?.language ?? "en") as never} speed={speed} />
          </div>
        </Card>

        {/* Suitcase */}
        <Card className="mb-4 border-2 border-emerald-300 bg-emerald-50/30 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-700" />
            <span className="font-medium text-foreground">Your bag ({packedCount} items)</span>
          </div>
          {packedCount === 0 ? (
            <p className="text-sm text-muted-foreground">Tap items below to add them to your bag.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {round.items.filter((i) => packed.has(i.id)).map((item) => {
                const Icon = ICONS[item.icon] ?? Package;
                return (
                  <motion.div key={item.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-medium shadow-soft">
                    <Icon className="h-4 w-4 text-emerald-600" />
                    {t(item.label)}
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Items to select */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {round.items.map((item) => {
            const Icon = ICONS[item.icon] ?? Package;
            const isPacked = packed.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => togglePack(item)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  isPacked
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                    : "border-border bg-card hover:border-emerald-300"
                }`}
              >
                <Icon className={`h-8 w-8 ${isPacked ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium text-center">{t(item.label)}</span>
                {isPacked && <Check className="h-4 w-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Hint + Confirm */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="lg" className="h-12 gap-2" onClick={() => { setShowHint(true); setHintsUsed((h) => h + 1); }}>
            <Lightbulb className="h-4 w-4" /> Hint
          </Button>
          <Button size="lg" className="h-12 gap-2 bg-primary text-primary-foreground" onClick={confirmPacking} disabled={packedCount === 0}>
            <Package className="h-4 w-4" /> Done packing <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {showHint && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Lightbulb className="mr-1.5 inline h-4 w-4" />
            {t(round.scenario.hint)}
          </motion.div>
        )}
      </Shell>
    );
  }

  // ── RECALL ("Did we forget anything?") ──
  if (phase === "recall" && round) {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="mb-4 bg-sky-50/60 p-5">
          <p className="text-lg font-semibold text-foreground">{t(round.missingItemQuestion.prompt)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{""}</p>
          <div className="mt-3">
            <ListenButton text={t(round.missingItemQuestion.prompt)} lang={(profile?.language ?? "en") as never} speed={speed} />
          </div>
        </Card>

        {/* Already packed items */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-muted-foreground">Already in your bag:</p>
          <div className="flex flex-wrap gap-2">
            {round.items.filter((i) => i.correct && packed.has(i.id)).map((item) => {
              const Icon = ICONS[item.icon] ?? Package;
              return (
                <span key={item.id} className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-sm">
                  <Icon className="h-3.5 w-3.5 text-emerald-600" /> {t(item.label)} <Check className="h-3 w-3 text-emerald-500" />
                </span>
              );
            })}
          </div>
        </div>

        <p className="mb-3 text-sm font-medium text-foreground">Which of these did you forget?</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {round.missingItemQuestion.options.map((item) => {
            const Icon = ICONS[item.icon] ?? Package;
            return (
              <button
                key={item.id}
                onClick={() => answerRecall(item.id)}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-sky-300 hover:bg-sky-50/40"
              >
                <Icon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-center">{t(item.label)}</span>
              </button>
            );
          })}
        </div>
      </Shell>
    );
  }

  // ── FEEDBACK ──
  if (phase === "feedback" && feedback) {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="p-6 text-center">
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${feedback.correct ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
          >
            {feedback.correct ? <Check className="h-8 w-8" /> : <Lightbulb className="h-8 w-8" />}
          </motion.span>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">
            {feedback.correct ? t("wellDone") : t("thatsOkay")}
          </h2>
          <p className="mt-2 rounded-xl bg-muted/60 p-4 text-base text-foreground">{feedback.message}</p>
          <p className="mt-2 text-sm text-muted-foreground">Score: {score}</p>
        </Card>
      </Shell>
    );
  }

  // ── COMPLETE ──
  return (
    <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
      <Card className="p-8 text-center">
        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Trophy className="h-8 w-8" />
        </motion.span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">{t("wellDone")}</h2>
        <p className="mt-1 text-muted-foreground">Final score: {score}</p>
        <p className="mt-2 text-sm font-medium text-emerald-700">Cognitive skills practiced: Memory, Attention, Decision-making</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="score" value={String(totalRounds)} />
          <Stat label="Score" value={String(score)} />
          <Stat label="score" value={String(hintsUsed)} />
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" size="lg" className="h-12 gap-1.5" onClick={() => { setPhase("intro"); }}>
            <RotateCw className="h-4 w-4" /> {t("activity.tryAgain")}
          </Button>
          <Button size="lg" className="h-12 gap-1.5 bg-primary text-primary-foreground" onClick={onExit}>
            <ArrowRight className="h-4 w-4" /> {t("activity.tryAnother")}
          </Button>
        </div>
      </Card>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-serif text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Shell({ children, onExit, speed, setSpeed }: { children: React.ReactNode; onExit: () => void; speed: any; setSpeed: any }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <BackButton label="Back to activities" onClick={onExit} />
          <VoiceSpeedControl speed={speed} setSpeed={setSpeed} />
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </main>
  );
}
