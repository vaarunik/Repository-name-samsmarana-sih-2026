"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, RotateCw, Trophy, Pause, Play, Apple, ArrowUp, ArrowDown, ArrowLeft, ArrowRight as ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "./BackButton";
import { VoiceSpeedControl } from "./VoiceControls";
import { useVoiceSpeed } from "@/lib/voice";
import { useApp } from "@/lib/store";
import { recordAttempt } from "@/lib/sync";
import { snakeConfig, adaptiveDifficulty } from "@/lib/puzzle-data";
import { motion } from "framer-motion";

type Phase = "intro" | "playing" | "paused" | "complete";
type Dir = "up" | "down" | "left" | "right";

export function SnakeGame({ onExit }: { onExit: () => void }) {
  const profile = useApp((s) => s.profile);
  const [speed, setSpeed] = useVoiceSpeed();
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState(1);
  const config = snakeConfig(difficulty);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 2, y: 2 }]);
  const [apple, setApple] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState<Dir>("right");
  const [score, setScore] = useState(0);
  const [applesEaten, setApplesEaten] = useState(0);
  const dirRef = useRef<Dir>("right");
  const gameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (gameRef.current) clearInterval(gameRef.current); };
  }, []);

  const placeApple = useCallback((snakeBody: { x: number; y: number }[]) => {
    let x: number, y: number;
    do {
      x = Math.floor(Math.random() * config.gridSize);
      y = Math.floor(Math.random() * config.gridSize);
    } while (snakeBody.some((s) => s.x === x && s.y === y));
    return { x, y };
  }, [config.gridSize]);

  const start = () => {
    const startSnake = [{ x: 2, y: Math.floor(config.gridSize / 2) }];
    setSnake(startSnake);
    setApple(placeApple(startSnake));
    setDir("right");
    dirRef.current = "right";
    setScore(0);
    setApplesEaten(0);
    setPhase("playing");
  };

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    gameRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const d = dirRef.current;
        let nx = head.x, ny = head.y;
        if (d === "up") ny--;
        if (d === "down") ny++;
        if (d === "left") nx--;
        if (d === "right") nx++;

        // Gentle boundary: wrap around instead of dying (dementia-friendly)
        if (nx < 0) nx = config.gridSize - 1;
        if (nx >= config.gridSize) nx = 0;
        if (ny < 0) ny = config.gridSize - 1;
        if (ny >= config.gridSize) ny = 0;

        const newHead = { x: nx, y: ny };
        const newBody = [newHead, ...prev];

        // Check apple
        if (nx === apple.x && ny === apple.y) {
          setScore((s) => s + 10);
          setApplesEaten((a) => a + 1);
          setApple(placeApple(newBody));
          // Snake grows (don't remove tail)
        } else {
          newBody.pop(); // remove tail
        }

        return newBody;
      });
    }, config.speedMs);
    return () => { if (gameRef.current) clearInterval(gameRef.current); };
  }, [phase, config.speedMs, config.gridSize, apple, placeApple]);

  const changeDir = (newDir: Dir) => {
    const opposites: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
    if (opposites[newDir] !== dirRef.current) {
      dirRef.current = newDir;
      setDir(newDir);
    }
  };

  // Keyboard
  useEffect(() => {
    if (phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") changeDir("up");
      if (e.key === "ArrowDown") changeDir("down");
      if (e.key === "ArrowLeft") changeDir("left");
      if (e.key === "ArrowRight") changeDir("right");
      if (e.key === " ") setPhase("paused");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  function finish() {
    if (gameRef.current) clearInterval(gameRef.current);
    const accuracy = applesEaten > 0 ? Math.min(applesEaten / 10, 1) : 0.3;
    const newDiff = adaptiveDifficulty(difficulty, accuracy);
    setDifficulty(newDiff);
    recordAttempt({
      id: crypto.randomUUID(),
      profileId: profile?.id ?? "anon",
      activityId: "snake-game",
      category: "concentration",
      title: t("game.startGame"),
      difficulty,
      accuracy,
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

  if (phase === "intro") {
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <Card className="overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white">
            <h2 className="font-serif text-3xl font-semibold">Snake Game</h2>
            <p className="mt-1 text-white/85">A slow, gentle game. Guide the snake to eat apples. Wraps around walls — no punishment.</p>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">Level {difficulty}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">Speed: {config.speedMs}ms</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">Grid: {config.gridSize}×{config.gridSize}</span>
            </div>
            <Button size="lg" className="mt-6 h-14 min-w-[160px] gap-2.5 rounded-2xl bg-primary text-base font-semibold text-primary-foreground" onClick={start}>
              <Apple className="h-5 w-5" /> Start game <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  if (phase === "playing" || phase === "paused") {
    const cellSize = Math.floor(280 / config.gridSize);
    return (
      <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">Score: {score}</h2>
          <div className="flex gap-2">
            <Badge className="bg-emerald-100 text-emerald-700">Apples: {applesEaten}</Badge>
            <Button size="sm" variant="outline" onClick={() => setPhase(phase === "paused" ? "playing" : "paused")}>
              {phase === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {phase === "paused" ? "▶" : "⏸"}
            </Button>
          </div>
        </div>

        {/* Game board */}
        <div className="mx-auto mb-6 rounded-2xl border-4 border-emerald-200 bg-emerald-50/40 p-2" style={{ width: cellSize * config.gridSize + 16 }}>
          <div className="relative" style={{ width: cellSize * config.gridSize, height: cellSize * config.gridSize }}>
            {/* Apple */}
            <div
              className="absolute flex items-center justify-center rounded-full bg-red-500 text-white"
              style={{ width: cellSize - 2, height: cellSize - 2, left: apple.x * cellSize, top: apple.y * cellSize }}
            >
              <Apple className="h-3/5 w-3/5" />
            </div>
            {/* Snake */}
            {snake.map((seg, i) => (
              <div
                key={i}
                className={`absolute rounded-md ${i === 0 ? "bg-emerald-600" : "bg-emerald-400"}`}
                style={{ width: cellSize - 2, height: cellSize - 2, left: seg.x * cellSize, top: seg.y * cellSize }}
              />
            ))}
            {phase === "paused" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <span className="text-lg font-semibold text-white">Paused</span>
              </div>
            )}
          </div>
        </div>

        {/* Large directional controls */}
        <div className="mx-auto grid max-w-[200px] grid-cols-3 gap-2">
          <div />
          <Button size="lg" className="h-14 rounded-2xl" onClick={() => changeDir("up")} disabled={phase === "paused"}>
            <ArrowUp className="h-6 w-6" />
          </Button>
          <div />
          <Button size="lg" className="h-14 rounded-2xl" onClick={() => changeDir("left")} disabled={phase === "paused"}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button size="lg" className="h-14 rounded-2xl" onClick={() => changeDir("down")} disabled={phase === "paused"}>
            <ArrowDown className="h-6 w-6" />
          </Button>
          <Button size="lg" className="h-14 rounded-2xl" onClick={() => changeDir("right")} disabled={phase === "paused"}>
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={finish}>Finish game</Button>
        </div>
      </Shell>
    );
  }

  // Complete
  return (
    <Shell onExit={onExit} speed={speed} setSpeed={setSpeed}>
      <Card className="p-8 text-center">
        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Trophy className="h-8 w-8" />
        </motion.span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-foreground">Well done!</h2>
        <p className="mt-1 text-muted-foreground">Score: {score} · {applesEaten} apples eaten</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="outline" size="lg" className="h-12 gap-1.5" onClick={() => setPhase("intro")}>
            <RotateCw className="h-4 w-4" /> Play again
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
