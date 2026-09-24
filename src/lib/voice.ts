"use client";

// SAMSMARANA — voice layer (Web Speech API)
//
// TTS and STT both follow the user's selected language via the centralized
// language configuration in i18n.ts (speechLocaleFor / languageDef).
//
// KEY FIXES:
//  1. TTS: voices are loaded asynchronously — we now cache them in state and
//     re-render when they arrive, so speak() always has the voice list. We no
//     longer silently fall back to an English voice for non-English languages.
//  2. STT: the supported flag is set eagerly (not deferred), and error states
//     (permission denied, no speech, etc.) are surfaced to the caller.

import { useCallback, useEffect, useRef, useState } from "react";
import { speechLocaleFor, languageDef, type LanguageCode } from "./i18n";

export type VoiceSpeed = "slow" | "normal";

const SPEED_RATE: Record<VoiceSpeed, number> = {
  slow: 0.8,
  normal: 1,
};

// ── Global voice cache (shared across all useSpeak instances) ──────
let cachedVoices: SpeechSynthesisVoice[] = [];
const voiceListeners: Set<() => void> = new Set();

function notifyVoiceListeners() {
  voiceListeners.forEach((fn) => fn());
}

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const v = window.speechSynthesis.getVoices();
  if (v && v.length > 0) {
    cachedVoices = v;
    notifyVoiceListeners();
  }
}

// Initialize voice loading on module import
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/** Speak text aloud in the user's language, at the chosen speed. */
export function useSpeak(lang: LanguageCode, speed: VoiceSpeed) {
  const [speaking, setSpeaking] = useState(false);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Subscribe to voice-list changes so we re-render when voices arrive.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const fn = () => forceUpdate((n) => n + 1);
    voiceListeners.add(fn);
    // Also try loading now (voices may have arrived since module init)
    loadVoices();
    return () => { voiceListeners.delete(fn); };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      setVoiceUnavailable(false);
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const def = languageDef(lang);
        u.lang = def.speechLocale;
        u.rate = SPEED_RATE[speed];
        u.pitch = 1;

        // Use the global cached voice list (not a fresh getVoices() call
        // which may return empty if voices haven't loaded yet).
        const voices = cachedVoices.length > 0
          ? cachedVoices
          : window.speechSynthesis.getVoices();

        if (voices.length > 0) {
          // Try exact locale match first (e.g. "kn-IN")
          let voice = voices.find(
            (v) => v.lang?.toLowerCase() === def.speechLocale.toLowerCase()
          );
          // Try language-prefix match (e.g. "kn" matches "kn-IN")
          if (!voice) {
            const langPrefix = def.speechLocale.split("-")[0].toLowerCase();
            voice = voices.find((v) =>
              v.lang?.toLowerCase().startsWith(langPrefix)
            );
          }
          // If no voice for the selected language AND the language is not
          // English, do NOT silently fall back to English. Instead, set
          // voiceUnavailable so the caller can inform the user.
          if (!voice && lang !== "en") {
            // Try English as a last resort but mark as unavailable
            voice = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
            if (voice) {
              u.voice = voice;
              u.lang = voice.lang;
            }
            setVoiceUnavailable(true);
          } else if (voice) {
            u.voice = voice;
            u.lang = voice.lang;
          }
        }

        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch {
        setSpeaking(false);
      }
    },
    [lang, speed, supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported, voiceUnavailable };
}

// ── STT (Speech Recognition) ───────────────────────────────────────

export interface ListenState {
  start: () => void;
  stop: () => void;
  reset: () => void;
  listening: boolean;
  transcript: string;
  supported: boolean;
  error: string | null;
}

/** Listen for a spoken answer (SpeechRecognition). */
export function useListen(lang: LanguageCode): ListenState {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  // Eagerly detect support via lazy initial state (runs once on first render,
  // so the mic button is visible immediately — no deferred setTimeout).
  const [supported] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  });
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);
  const langRef = useRef(lang);

  // Keep langRef in sync so recognition uses the latest language.
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Voice input is not supported on this browser.");
      return;
    }
    setError(null);
    try {
      // Stop any existing recognition
      if (recRef.current) {
        try { recRef.current.stop(); } catch {}
      }
      const rec = new SR();
      rec.lang = speechLocaleFor(langRef.current);
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;

      rec.onstart = () => {
        setListening(true);
        setTranscript("");
        setError(null);
      };
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript ?? "";
        setTranscript(text);
      };
      rec.onerror = (e: any) => {
        const errType = e?.error ?? "unknown";
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          setError("Microphone permission is required for voice input.");
        } else if (errType === "no-speech") {
          setError("No speech detected. Please try again.");
        } else if (errType === "audio-capture") {
          setError("No microphone found. Please connect a microphone.");
        } else if (errType === "network") {
          setError("Network error during speech recognition.");
        } else {
          setError("Voice input error. Please try again.");
        }
        setListening(false);
      };
      rec.onend = () => setListening(false);

      recRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      setError("Could not start voice input. Please try again.");
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {}
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { start, stop, reset, listening, transcript, supported, error };
}

/** Persist voice-speed preference in localStorage. */
export function useVoiceSpeed(): [VoiceSpeed, (s: VoiceSpeed) => void] {
  const [speed, setSpeed] = useState<VoiceSpeed>(() => {
    if (typeof window === "undefined") return "slow";
    try {
      const v = localStorage.getItem("sm_voice_speed");
      if (v === "normal" || v === "slow") return v;
    } catch {}
    return "slow";
  });
  const set = useCallback((s: VoiceSpeed) => {
    setSpeed(s);
    try {
      localStorage.setItem("sm_voice_speed", s);
    } catch {}
  }, []);
  return [speed, set];
}
