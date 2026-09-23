"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, X, RotateCw, Trophy, Puzzle, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "./BackButton";
import { VoiceSpeedControl } from "./VoiceControls";
import { useVoiceSpeed } from "@/lib/voice";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { recordAttempt } from "@/lib/sync";
import { buildPuzzleSet, adaptiveDifficulty, type PuzzleQuestion } from "@/lib/puzzle-data";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "intro" | "observe" | "question" | "feedback" | "complete";

export function PuzzleGamePlayer({ onExit }: { onExit: () => void }) {
  const profile = useApp((s) => s.profile);
  const [speed, setSpeed] = useVoiceSpeed();
  const t = useT();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState(2);
  const [questions, setQuestions] = useState<PuzzleQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([]);
  const [observeTimer, setObserveTimer] = useState(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      if (observeTimerRef.current) clearInterval(observeTimerRef.current);
    };
  }, []);

  function startSession() {
    const qs = buildPuzzleSet(difficulty, 4);
    setQuestions(qs);
    setQi(0);
    setAnswers([]);
    setPhase(qs[0].type === "remember_find" || qs[0].type === "missing_object" ? "observe" : "question");
    if (qs[0].type === "remember_find" || qs[0].type === "missing_object") {
      startObserveTimer();
    }
  }

  function startObserveTimer() {
    setObserveTimer(5);
    let count = 5;
    observeTimerRef.current = setInterval(() => {
      count--;
      setObserveTimer(count);
      if (count <= 0) {
        if (observeTimerRef.current) clearInterval(observeTimerRef.current);
        setPhase("question");
      }
    }, 1000);
  }

  const currentQ = questions[qi];

  function answer(correct: boolean) {
    const next = [...answers];
    next[qi] = correct;
    setAnswers(next);
    setPhase("feedback");
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      if (qi < questions.length - 1) {
        setQi(qi + 1);
        const nextQ = questions[qi + 1];
        if (nextQ && (nextQ.type === "remember_find" || nextQ.type === "missing_object")) {
          setPhase("observe");
          startObserveTimer();
        } else {
          setPhase("question");
        }
      } else {
        finish(next);
      }
    }, 1500);
  }

  function selectAnswer(idx: number) {
    if (!currentQ) return;
    answer(idx === currentQ.answerIndex);
  }

  // Sequence puzzle: user arranges by clicking in order
  const [seqOrder, setSeqOrder] = useState<number[]>([]);
  function toggleSeqItem(idx: number) {
    if (seqOrder.includes(idx)) {
      setSeqOrder(seqOrder.filter((i) => i !== idx));
    } else {
      const newOrder = [...seqOrder, idx];
      setSeqOrder(newOrder);
      if (newOrder.length === currentQ.options.length) {
        // Check if correct
        const correct = currentQ.correctSequence ?? [];
        const userSeq = newOrder.map((i) => currentQ.options[i]);
        const isCorrect = correct.every((item, i) => userSeq[i] === item);
        setTimeout(() => answer(isCorrect), 300);
      }
    }
  }

  async function finish(finalAnswers: (boolean | null)[]) {
    const correct = finalAnswers.filter((a) => a === true).length;
    const accuracy = finalAnswers.length ? correct / finalAnswers.length : 0;
    // Adaptive difficulty
    const newDiff = adaptiveDifficulty(difficulty, accuracy);
    setDifficulty(newDiff);
    // Record attempt
    const { recordAttempt } = await import("@/lib/sync");
    const { v4: uuidv4 } = await import("uuid");
    recordAttempt({
      id: crypto.randomUUID(),
      profileId: profile?.id ?? "anon",
      activityId: "puzzle-games",
      category: "problem_solving",
      title: "Puzzle Games",
      difficulty,
      accuracy,
      responseMs: 0,
      completed: true,
      skipped: false,
      score: Math.round(accuracy * 100),
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
          <div className="relative bg-gradient-to-br from-teal-600 to-emerald-600 p-8 text-white">
            <Badge className="bg-white/20 text-white">{t("elder.cognitiveActivities")}</Badge>
            <h2 className="mt-3 font-serif text-3xl font-semibold">Puzzle Games</h2>
            <p className="mt-1 text-white/85">Adaptive puzzles that change every time — odd-one-out, patterns, sequences, and more.</p>
          </div>
          <div className="p-6">
            <p className="text-base text-foreground">Each session has 4 varied puzzles. Difficulty adapts to your performance.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">Level {difficulty}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">4 puzzles</span>
            </div>
            <Button size="lg" className="mt-6 h-14 min-w-[160px] gap-2.5 rounded-2xl bg-primary text-base font-semibold text-primary-foreground" onClick={startSession}>
              <Puzzle className="h-5 w-5" /> Start puzzles <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  // ── OBSERVE (for remember-find / missing-object) ──
  if (phase === "observe" && currentQ) {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">Look at these objects</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <Eye className="h-4 w-4" /> {observeTimer}s
          </span>
        </div>
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {(currentQ.shownObjects ?? []).map((obj, i) => (
              <div key={i} className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-lg font-medium capitalize text-foreground shadow-soft">
                {obj}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Memorize these objects…</p>
        </Card>
        <Button size="lg" variant="outline" className="mt-4 h-12 gap-2" onClick={() => { if (observeTimerRef.current) clearInterval(observeTimerRef.current); setPhase("question"); }}>
          <EyeOff className="h-4 w-4" /> I'm ready
        </Button>
      </Shell>
    );
  }

  // ── QUESTION ──
  if (phase === "question" && currentQ) {
    const promptLines = currentQ.prompt.split("\n");
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span className="text-base font-medium text-foreground">Puzzle {qi + 1} of {questions.length}</span>
          <span>Level {difficulty}</span>
        </div>
        <Progress value={((qi + 1) / questions.length) * 100} className="mb-4 h-2.5" />
        <Card className="p-6">
          {promptLines.map((line, i) => (
            <h2 key={i} className={i === 0 ? "font-serif text-2xl font-semibold text-foreground" : "mt-2 text-lg text-muted-foreground"}>
              {line}
            </h2>
          ))}

          {/* Sequence puzzle: arrange by clicking */}
          {currentQ.type === "sequence" ? (
            <div className="mt-5">
              <p className="mb-3 text-sm text-muted-foreground">Click the items in the correct order:</p>
              <div className="flex flex-wrap gap-2">
                {currentQ.options.map((opt, i) => {
                  const orderIdx = seqOrder.indexOf(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleSeqItem(i)}
                      className={`rounded-xl border-2 px-5 py-4 text-lg font-medium transition-all ${
                        orderIdx >= 0
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-border bg-card hover:border-emerald-300"
                      }`}
                    >
                      {opt} {orderIdx >= 0 && <span className="ml-2 rounded-full bg-emerald-500 px-2 text-xs text-white">{orderIdx + 1}</span>}
                    </button>
                  );
                })}
              </div>
              {seqOrder.length > 0 && (
                <Button size="sm" variant="ghost" className="mt-3" onClick={() => setSeqOrder([])}>
                  Reset order
                </Button>
              )}
            </div>
          ) : (
            /* Standard MCQ */
            <div className="mt-5 grid gap-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className="flex min-h-[56px] items-center rounded-2xl border-2 border-border bg-card px-5 py-4 text-left text-lg font-medium transition-all hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </Card>
      </Shell>
    );
  }

  // ── FEEDBACK ──
  if (phase === "feedback" && currentQ) {
    const correct = answers[qi] === true;
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="p-6 text-center">
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${correct ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
          >
            {correct ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
          </motion.span>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">
            {correct ? t("wellDone") : t("thatsOkay")}
          </h2>
          <p className="mt-2 rounded-xl bg-muted/60 p-4 text-base text-foreground">{currentQ.explanation}</p>
        </Card>
      </Shell>
    );
  }

  // ── COMPLETE ──
  const correct = answers.filter((a) => a === true).length;
  const accuracy = answers.length ? correct / answers.length : 0;
  return (
    <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
      <Card className="p-8 text-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
        >
          <Trophy className="h-8 w-8" />
        </motion.span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">
          {accuracy >= 0.8 ? t("wellDone") : accuracy >= 0.5 ? t("niceEffort") : t("thatsOkay")}
        </h2>
        <p className="mt-1 text-muted-foreground">{correct} of {answers.length} correct.</p>
        <p className="mt-2 text-sm font-medium text-emerald-700">Cognitive skill practiced: Problem Solving</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label={t("accuracy")} value={`${Math.round(accuracy * 100)}%`} />
          <Stat label="Puzzles" value={String(answers.length)} />
          <Stat label={t("score")} value={String(Math.round(accuracy * 100))} />
        </div>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" size="lg" className="h-12 gap-1.5" onClick={() => { setSeqOrder([]); setPhase("intro"); }}>
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
