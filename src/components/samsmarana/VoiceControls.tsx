"use client";

// SAMSMARANA — voice controls (large, obvious, elder-friendly).
// Per the spec: a large 🔊 Listen button for instructions and a large
// 🎙️ Speak your answer button for voice input. Never hidden in a tiny icon.
//
// FIX: The SpeakAnswerButton no longer returns null when unsupported — it
// shows a disabled button with an elderly-friendly message. Error states
// (permission denied, no speech, unsupported) are surfaced clearly.

import { Volume2, Square, Mic, AudioLines, AlertCircle, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeak, useListen, type VoiceSpeed } from "@/lib/voice";
import type { LanguageCode } from "@/lib/i18n";

/** Large "🔊 Listen" button that speaks the given instruction. */
export function ListenButton({
  text,
  lang,
  speed,
  className,
  label = "Listen",
}: {
  text: string;
  lang: LanguageCode;
  speed: VoiceSpeed;
  className?: string;
  label?: string;
}) {
  const { speak, stop, speaking, supported, voiceUnavailable } = useSpeak(lang, speed);

  if (!supported) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Button type="button" size="lg" disabled className="h-14 min-w-[140px] gap-2.5 rounded-2xl text-base font-semibold opacity-60">
          <Volume2 className="h-5 w-5" /> {label}
        </Button>
        <p className="text-xs text-muted-foreground">Voice output is not supported on this browser.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Button
        type="button"
        size="lg"
        onClick={() => (speaking ? stop() : speak(text))}
        className={cn(
          "h-14 min-w-[140px] gap-2.5 rounded-2xl text-base font-semibold",
          speaking
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        )}
        aria-label={speaking ? "Stop listening" : label}
      >
        {speaking ? (
          <>
            <Square className="h-5 w-5" /> Stop
          </>
        ) : (
          <>
            <Volume2 className="h-5 w-5" /> {label}
          </>
        )}
      </Button>
      {voiceUnavailable && (
        <p className="text-xs text-amber-600">
          A {lang} voice is not available on this device. Speaking in a fallback voice.
        </p>
      )}
    </div>
  );
}

/** Large "🎙️ Speak your answer" button with listening state + transcript. */
export function SpeakAnswerButton({
  lang,
  onTranscript,
  className,
}: {
  lang: LanguageCode;
  onTranscript: (text: string) => void;
  className?: string;
}) {
  const { start, stop, listening, transcript, supported, error, reset } = useListen(lang);

  // If STT is unsupported, show a disabled button with a message instead
  // of hiding the feature entirely (the old code returned null).
  if (!supported) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <Button type="button" size="lg" disabled className="h-14 gap-2.5 rounded-2xl text-base font-semibold opacity-60">
          <MicOff className="h-5 w-5" /> Speak your answer
        </Button>
        <p className="text-xs text-muted-foreground">
          Voice input is not supported on this browser. You can select an answer above.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        type="button"
        size="lg"
        onClick={() => {
          if (listening) {
            stop();
          } else {
            reset();
            start();
          }
        }}
        className={cn(
          "h-14 gap-2.5 rounded-2xl text-base font-semibold",
          listening
            ? "bg-rose-600 text-white hover:bg-rose-700"
            : "bg-sky-700 text-white hover:bg-sky-800"
        )}
        aria-label={listening ? "Stop listening" : "Speak your answer"}
      >
        {listening ? (
          <>
            <AudioLines className="h-5 w-5 animate-pulse" /> Listening…
          </>
        ) : (
          <>
            <Mic className="h-5 w-5" /> Speak your answer
          </>
        )}
      </Button>

      {/* Error message (permission denied, no speech, etc.) */}
      {error && !listening && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Recognized text */}
      {transcript && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
          <span className="text-sm">
            <span className="font-semibold">I heard:</span> “{transcript}”
          </span>
          <button
            type="button"
            onClick={() => {
              reset();
              start();
            }}
            className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}
      {listening && !transcript && !error && (
        <p className="text-sm text-muted-foreground">Listening… speak clearly.</p>
      )}
    </div>
  );
}

/** Voice speed preference control (Slow / Normal). */
export function VoiceSpeedControl({
  speed,
  setSpeed,
  className,
}: {
  speed: VoiceSpeed;
  setSpeed: (s: VoiceSpeed) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MicOff className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="text-sm text-muted-foreground">Voice speed</span>
      <div className="flex rounded-full border border-border bg-muted/40 p-0.5">
        {(["slow", "normal"] as VoiceSpeed[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSpeed(s)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
              speed === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
