"use client";

import { ArrowRight, Sparkles, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "./BackButton";
import { Waves } from "./Waves";
import { useApp } from "@/lib/store";
import { SCENE_META } from "@/lib/activities-data";
import type { ActivityTemplate } from "@/lib/activities-data";

/**
 * Personalized Video Activities — COMING SOON.
 *
 * Per the master spec: the previous (broken) Gemini/Veo generation UI is
 * DISABLED. There is no fake generation, no "Video generation unavailable"
 * spinner, no "Try Again" loop. Instead this screen presents the feature as
 * a clearly-labelled upcoming capability with a realistic visual preview,
 * and immediately offers the working visual cognitive activity below.
 */
export function VideoComingSoon({
  activity,
  onExit,
  onUseStandard,
}: {
  activity: ActivityTemplate;
  onExit: () => void;
  onUseStandard: () => void;
}) {
  const profile = useApp((s) => s.profile);
  const scene = SCENE_META[activity.scene];

  return (
    <main className="flex-1 bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <BackButton label="Back to activities" onClick={onExit} />

        <div className="mt-4">
          <Badge className="bg-amber-100 text-amber-800">
            <Sparkles className="mr-1 h-3 w-3" /> Coming Soon
          </Badge>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
            Personalized Video Activities
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Samsmarana will soon create personalized, realistic memory activities using
            AI-generated video scenes tailored to each elder&apos;s interests, language and
            region — built on Google&apos;s Gemini &amp; Veo. For now, please enjoy the visual
            cognitive activity below.
          </p>
        </div>

        {/* Beautiful realistic preview with a "Coming Soon" overlay */}
        <Card className="mt-5 overflow-hidden p-0">
          <div className="relative">
            { }
            <img
              src={scene.image}
              alt={`${scene.label} preview`}
              className="aspect-video w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
            <Waves className="absolute inset-x-0 bottom-0 h-24 w-full opacity-30 text-white" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-lift">
                <PlayCircle className="h-10 w-10" />
              </div>
              <Badge className="mt-4 bg-amber-400/95 px-4 py-1.5 text-sm font-semibold text-amber-950">
                Coming Soon
              </Badge>
              <p className="mt-2 text-center text-white/90">
                Personalized AI video for {profile?.regionState ?? "your region"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> 8-second realistic scene
            </span>
            <span>Veo · culturally familiar · elder-friendly</span>
          </div>
        </Card>

        {/* Working visual activity */}
        <Card className="mt-6 p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            For now, try the visual activity
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This {scene.label.toLowerCase()} activity works fully today — look carefully, then
            answer the questions.
          </p>
          <Button
            size="lg"
            className="mt-4 h-14 min-w-[180px] gap-2.5 rounded-2xl bg-primary text-base font-semibold text-primary-foreground"
            onClick={onUseStandard}
          >
            Start visual activity
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Card>
      </div>
    </main>
  );
}
