"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  RotateCw,
  Clock,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "./BackButton";
import { useApp } from "@/lib/store";
import { recordAttempt } from "@/lib/sync";
import { buildQuestions, sceneObjects } from "@/lib/questions";
import { SCENE_META } from "@/lib/activities-data";
import type { ActivityTemplate } from "@/lib/activities-data";
import type { AttemptRecord, Question } from "@/lib/types";

type Phase = "intro" | "memorize" | "questions" | "result";

export function ActivityPlayer({
  activity,
  onExit,
}: {
  activity: ActivityTemplate;
  onExit: () => void;
}) {
  const profile = useApp((s) => s.profile);
  const [phase, setPhase] = useState<Phase>("intro");
  const questions = useMemo<Question[]>(
    () => buildQuestions(activity.scene, activity.category, activity.difficulty),
    [activity]
  );
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const startRef = useRef<number>(0);
  const qStartRef = useRef<number>(0);
  const [responseMs, setResponseMs] = useState(0);

  const objects = useMemo(() => sceneObjects(activity.scene), [activity]);
  const scene = SCENE_META[activity.scene];

  // memorize countdown
  const [count, setCount] = useState(6);
  useEffect(() => {
    if (phase !== "memorize") return;
    setCount(6);
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          setPhase("questions");
          startRef.current = Date.now();
          qStartRef.current = Date.now();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  function answer(idx: number) {
    const next = [...answers];
    next[qi] = idx;
    setAnswers(next);
    const rt = Date.now() - qStartRef.current;
    setResponseMs((r) => r + rt);
    setTimeout(() => {
      if (qi < questions.length - 1) {
        setQi(qi + 1);
        qStartRef.current = Date.now();
      } else {
        finish(next);
      }
    }, 450);
  }

  async function finish(finalAnswers: (number | null)[]) {
    const correct = questions.reduce(
      (s, q, i) => s + (finalAnswers[i] === q.answerIndex ? 1 : 0),
      0
    );
    const accuracy = questions.length ? correct / questions.length : 0;
    const totalRt = Date.now() - startRef.current;
    const attempt: AttemptRecord = {
      id: crypto.randomUUID(),
      profileId: profile?.id ?? "anon",
      activityId: activity.id,
      category: activity.category,
      title: activity.title,
      difficulty: activity.difficulty,
      accuracy,
      responseMs: totalRt,
      completed: true,
      skipped: false,
      score: Math.round(accuracy * 100),
      syncState: "synced",
      syncId: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await recordAttempt(attempt);
    setPhase("result");
  }

  if (phase === "intro") {
    return (
      <Shell onExit={onExit} backLabel="Back to activities">
        <Card className="overflow-hidden p-0">
          <div className={`relative bg-gradient-to-br ${sceneTone(activity.scene)} p-8 text-white`}>
            <Badge className="bg-white/20 text-white">{scene.label}</Badge>
            <h2 className="mt-3 font-serif text-3xl font-semibold">{activity.title}</h2>
            <p className="mt-1 text-white/85">{activity.description}</p>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">
              You&apos;ll see a short scene to remember, then a few questions.
              Take your time — there&apos;s no rush.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                Difficulty {activity.difficulty}/5
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                <Clock className="h-3 w-3" /> ~2 minutes
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
                Standard activity
              </span>
            </div>
            <Button
              className="mt-6 w-full gap-2 bg-primary text-primary-foreground sm:w-auto"
              size="lg"
              onClick={() => setPhase("memorize")}
            >
              Start activity
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  if (phase === "memorize") {
    return (
      <Shell onExit={onExit} backLabel="Back">
        <Card className="overflow-hidden p-0">
          <div className={`relative bg-gradient-to-br ${sceneTone(activity.scene)} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <Badge className="bg-white/20 text-white">{scene.label}</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-sm font-medium">
                <Clock className="h-4 w-4" /> {count}s
              </span>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">Remember this scene</h2>
            <p className="text-white/85">{scene.setting}</p>
          </div>
          <div className="p-6">
            <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
              Take in these details
            </p>
            <div className="flex flex-wrap gap-2">
              {objects.map((o) => (
                <span
                  key={o}
                  className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium capitalize text-foreground shadow-soft"
                >
                  {o}
                </span>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-6 w-full gap-2 sm:w-auto"
              onClick={() => {
                setPhase("questions");
                startRef.current = Date.now();
                qStartRef.current = Date.now();
              }}
            >
              I&apos;m ready
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  if (phase === "questions") {
    const q = questions[qi];
    const answered = answers[qi];
    return (
      <Shell onExit={onExit} backLabel="Back">
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {qi + 1} of {questions.length}</span>
          <span className="capitalize">{activity.category.replace("_", " ")}</span>
        </div>
        <Progress value={((qi + 1) / questions.length) * 100} className="mb-4 h-2" />
        <Card className="p-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground text-balance">
            {q.prompt}
          </h2>
          <div className="mt-5 grid gap-2.5">
            {q.options.map((opt, i) => {
              const isAnswer = i === q.answerIndex;
              const isPicked = answered === i;
              const reveal = answered != null;
              return (
                <button
                  key={i}
                  disabled={reveal}
                  onClick={() => answer(i)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left text-base transition-colors ${
                    reveal && isAnswer
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                      : reveal && isPicked && !isAnswer
                        ? "border-rose-300 bg-rose-50 text-rose-800"
                        : "border-border hover:bg-muted/60"
                  }`}
                >
                  <span className="capitalize">{opt}</span>
                  {reveal && isAnswer && <Check className="h-5 w-5 text-emerald-600" />}
                  {reveal && isPicked && !isAnswer && <X className="h-5 w-5 text-rose-500" />}
                </button>
              );
            })}
          </div>
          {answered !== null && q.explanation && (
            <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
              {q.explanation}
            </p>
          )}
        </Card>
      </Shell>
    );
  }

  // result
  const correct = questions.reduce(
    (s, q, i) => s + (answers[i] === q.answerIndex ? 1 : 0),
    0
  );
  const accuracy = questions.length ? correct / questions.length : 0;
  return (
    <Shell onExit={onExit} backLabel="Back to activities">
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Trophy className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">
          {accuracy >= 0.8 ? "Well done!" : accuracy >= 0.5 ? "Nice effort." : "Good try."}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {correct} of {questions.length} correct.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
          <Stat label="Time" value={`${Math.round(responseMs / 1000)}s`} />
          <Stat label="Score" value={String(Math.round(accuracy * 100))} />
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              setAnswers([]);
              setQi(0);
              setResponseMs(0);
              setPhase("intro");
            }}
          >
            <RotateCw className="h-4 w-4" /> Try again
          </Button>
          <Button className="gap-1.5 bg-primary text-primary-foreground" onClick={onExit}>
            Done
            <ArrowRight className="h-4 w-4" />
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

function Shell({
  children,
  onExit,
  backLabel,
}: {
  children: React.ReactNode;
  onExit: () => void;
  backLabel: string;
}) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <BackButton label={backLabel} onClick={onExit} />
        <div className="mt-4">{children}</div>
      </div>
    </main>
  );
}

function sceneTone(scene: string): string {
  const tones: Record<string, string> = {
    garden: "from-emerald-600 to-teal-600",
    market: "from-emerald-600 to-sky-600",
    shop: "from-teal-600 to-emerald-600",
    cooking: "from-amber-600 to-emerald-600",
    tea: "from-emerald-600 to-amber-600",
    train: "from-sky-600 to-emerald-600",
    nature: "from-emerald-600 to-sky-600",
    birds: "from-teal-600 to-sky-600",
    home: "from-emerald-700 to-teal-700",
    community: "from-emerald-600 to-teal-600",
    river: "from-sky-600 to-teal-600",
    festival: "from-amber-500 to-emerald-600",
  };
  return tones[scene] ?? "from-emerald-600 to-teal-600";
}
