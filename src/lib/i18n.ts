// SAMSMARANA — i18n
// Languages: English, Kannada, Hindi, Tamil, Telugu (all preserved).
// Architecture: dictionary lookup with English fallback so the UI
// NEVER shows raw keys, undefined, or null.

import type { LanguageCode } from "./types";

export const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "app.tagline": "Memory & Cognitive Engagement",
  "nav.home": "Home",
  "nav.activities": "Activities",
  "nav.reminders": "Reminders",
  "nav.progress": "Progress",
  "nav.profile": "Profile",
  "nav.family": "Family",
  "nav.caregiver": "Caregiver",
  "nav.overview": "Overview",
  "nav.history": "Activity History",
  "nav.performance": "Performance",
  "nav.trends": "Trends",
  "nav.recommendations": "Recommendations",
  "nav.settings": "Settings",
  "action.back": "Back",
  "action.continue": "Continue",
  "action.getStarted": "Get Started",
  "action.explore": "Explore Samsmarana",
  "action.generateVideo": "Generate Personalized Video",
  "action.startActivity": "Start Activity",
  "action.submit": "Submit",
  "action.next": "Next",
  "action.finish": "Finish",
  "action.retry": "Try Again",
  "action.standardActivity": "Continue with Standard Activity",
  "elder.welcome": "Welcome",
  "elder.whatNow": "What can I do now?",
  "video.preparing": "Preparing…",
  "video.generating": "Generating…",
  "video.almostReady": "Almost ready…",
  "video.unavailable":
    "Video generation is temporarily unavailable. You can continue with a standard activity.",
  "video.watchPrompt": "Watch the short scene, then answer the questions.",
  "offline.offline": "Offline",
  "offline.syncing": "Syncing…",
  "offline.synced": "Synced",
  "offline.pending": "Sync pending. We'll retry when you're connected.",
};

const kn: Dict = {
  "app.tagline": "ಸ್ಮರಣೆ ಮತ್ತು ಜ್ಞಾನಾತ್ಮಕ ತೊಡಗಿಸುವಿಕೆ",
  "nav.home": "ಮುಖಪುಟ",
  "nav.activities": "ಚಟುವಟಿಕೆಗಳು",
  "nav.reminders": "ಜ್ಞಾಪನೆಗಳು",
  "nav.progress": "ಪ್ರಗತಿ",
  "nav.profile": "ಪ್ರೊಫೈಲ್",
  "nav.family": "ಕುಟುಂಬ",
  "nav.caregiver": "ಆರೈಕೆದಾರ",
  "action.getStarted": "ಪ್ರಾರಂಭಿಸಿ",
  "action.continue": "ಮುಂದುವರಿಸಿ",
  "action.back": "ಹಿಂದೆ",
  "elder.welcome": "ಸ್ವಾಗತ",
  "elder.whatNow": "ಈಗ ನಾನು ಏನು ಮಾಡಬಹುದು?",
  "video.preparing": "ಸಿದ್ಧಗೊಳಿಸಲಾಗುತ್ತಿದೆ…",
  "video.generating": "ರಚಿಸಲಾಗುತ್ತಿದೆ…",
  "video.almostReady": "ಬಹುತೇಕ ಸಿದ್ಧ…",
  "offline.offline": "ಆಫ್‌ಲೈನ್",
  "offline.syncing": "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ…",
  "offline.synced": "ಸಿಂಕ್ ಆಯಿತು",
};

const hi: Dict = {
  "app.tagline": "स्मृति और संज्ञानात्मक संलग्नता",
  "nav.home": "होम",
  "nav.activities": "गतिविधियाँ",
  "nav.reminders": "रिमाइंडर",
  "nav.progress": "प्रगति",
  "nav.profile": "प्रोफ़ाइल",
  "nav.family": "परिवार",
  "nav.caregiver": "देखभाल करने वाला",
  "action.getStarted": "शुरू करें",
  "action.continue": "जारी रखें",
  "action.back": "वापस",
  "elder.welcome": "स्वागत है",
  "elder.whatNow": "अभी मैं क्या कर सकता हूँ?",
  "video.preparing": "तैयार किया जा रहा है…",
  "video.generating": "बनाया जा रहा है…",
  "video.almostReady": "लगभग तैयार…",
  "offline.offline": "ऑफ़लाइन",
  "offline.syncing": "सिंक हो रहा है…",
  "offline.synced": "सिंक हो गया",
};

const ta: Dict = {
  "app.tagline": "நினைவு & அறிவாற்றல் ஈடுபாடு",
  "nav.home": "முகப்பு",
  "nav.activities": "செயல்பாடுகள்",
  "nav.reminders": "நினைவூட்டல்கள்",
  "nav.progress": "முன்னேற்றம்",
  "nav.profile": "சுயவிவரம்",
  "nav.family": "குடும்பம்",
  "nav.caregiver": "பராமரிப்பாளர்",
  "action.getStarted": "தொடங்குக",
  "action.continue": "தொடரவும்",
  "action.back": "பின்செல்",
  "elder.welcome": "வரவேற்கிறோம்",
  "elder.whatNow": "இப்போது நான் என்ன செய்யலாம்?",
  "video.preparing": "தயாராகிறது…",
  "video.generating": "உருவாக்கப்படுகிறது…",
  "offline.offline": "ஆஃப்லைன்",
  "offline.synced": "ஒத்திசைக்கப்பட்டது",
};

const te: Dict = {
  "app.tagline": "జ్ఞాపక & జ్ఞానాత్మక నిమగ్నత",
  "nav.home": "హోమ్",
  "nav.activities": "కార్యకలాపాలు",
  "nav.reminders": "రిమైండర్‌లు",
  "nav.progress": "పురోగతి",
  "nav.profile": "ప్రొఫైల్",
  "nav.family": "కుటుంబం",
  "nav.caregiver": "సంరక్షకుడు",
  "action.getStarted": "ప్రారంభించండి",
  "action.continue": "కొనసాగించు",
  "action.back": "వెనుకకు",
  "elder.welcome": "స్వాగతం",
  "elder.whatNow": "ఇప్పుడు నేను ఏమి చేయగలను?",
  "video.preparing": "సిద్ధవుతోంది…",
  "video.generating": "రూపొందిస్తోంది…",
  "offline.offline": "ఆఫ్‌లైన్",
  "offline.synced": "సమకాలీకరించబడింది",
};

const DICTS: Record<LanguageCode, Dict> = { en, kn, hi, ta, te };

export function t(lang: LanguageCode, key: string): string {
  const d = DICTS[lang] ?? en;
  return d[key] ?? en[key] ?? key;
}

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

export function languageNative(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.native ?? "English";
}
