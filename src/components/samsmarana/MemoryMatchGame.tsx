"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowRight, RotateCw, Trophy, Grid3x3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "./BackButton";
import { VoiceSpeedControl } from "./VoiceControls";
import { useVoiceSpeed } from "@/lib/voice";
import { useApp } from "@/lib/store";
import { recordAttempt } from "@/lib/sync";
import { buildMemoryCards, adaptiveDifficulty, type MemoryCard } from "@/lib/puzzle-data";
import { motion } from "framer-motion";

type Phase = "intro" | "playing" | "complete";

export function MemoryMatchGame({ onExit }: { onExit: () => void }) {
  const profile = useApp((s) => s.profile);
  const [speed, setSpeed] = useVoiceSpeed();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState(2);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function start() {
    const newCards = buildMemoryCards(difficulty);
    setCards(newCards);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setPhase("playing");
  }

  function flip(idx: number) {
    if (!canFlip || matched.has(idx) || flipped.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].image === cards[b].image) {
        timerRef.current = setTimeout(() => {
          const newMatched = new Set(matched);
          newMatched.add(a);
          newMatched.add(b);
          setMatched(newMatched);
          setFlipped([]);
          setCanFlip(true);
          if (newMatched.size === cards.length) {
            finish(newMatched.size, moves + 1);
          }
        }, 600);
      } else {
        timerRef.current = setTimeout(() => {
          setFlipped([]);
          setCanFlip(true);
        }, 1200);
      }
    }
  }

  async function finish(totalMatched: number, totalMoves: number) {
    const pairCount = cards.length / 2;
    const accuracy = pairCount > 0 ? pairCount / totalMoves : 1;
    const newDiff = adaptiveDifficulty(difficulty, accuracy);
    setDifficulty(newDiff);
    recordAttempt({
      id: crypto.randomUUID(),
      profileId: profile?.id ?? "anon",
      activityId: "memory-match",
      category: "recall",
      title: t("elder.storyGames"),
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

  if (phase === "intro") {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-teal-600 to-sky-600 p-8 text-white">
            <h2 className="font-serif text-3xl font-semibold">Memory Match</h2>
            <p className="mt-1 text-white/85">Find matching pairs of real photographs. Starts simple and adapts to your performance.</p>
          </div>
          <div className="p-6">
            <Button size="lg" className="h-14 min-w-[160px] gap-2.5 rounded-2xl bg-primary text-base font-semibold text-primary-foreground" onClick={start}>
              <Grid3x3 className="h-5 w-5" /> Start <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  if (phase === "playing") {
    const progress = matched.size / cards.length * 100;
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">Find the matching pairs</h2>
          <span className="text-sm text-muted-foreground">Moves: {moves}</span>
        </div>
        <Progress value={progress} className="mb-4 h-2.5" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.has(idx);
            const isMatched = matched.has(idx);
            return (
              <button
                key={card.id}
                onClick={() => flip(idx)}
                className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition-all ${
                  isMatched
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : isFlipped
                      ? "border-teal-400"
                      : "border-border bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isFlipped ? (
                   
                  <img src={card.image} alt={card.label} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-3xl text-white/80">?</span>
                )}
                {isMatched && (
                  <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Shell>
    );
  }

  // Complete
  const pairCount = cards.length / 2;
  const accuracy = pairCount > 0 ? pairCount / moves : 1;
  return (
    <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
      <Card className="p-8 text-center">
        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Trophy className="h-8 w-8" />
        </motion.span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">Well done!</h2>
        <p className="mt-1 text-muted-foreground">{pairCount} pairs found in {moves} moves.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" size="lg" className="h-12 gap-1.5" onClick={() => setPhase("intro")}>
            <RotateCw className="h-4 w-4" /> Try again
          </Button>
          <Button size="lg" className="h-12 gap-1.5 bg-primary text-primary-foreground" onClick={onExit}>
            <ArrowRight className="h-4 w-4" /> Done
          </Button>
        </div>
      </Card>
    </Shell>
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
