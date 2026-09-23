// SAMSMARANA — language + voice architecture
//
// Languages (region and language are INDEPENDENT):
//   English, Kannada, Hindi, Tamil, Telugu  (existing)
//   Assamese, Bengali, Manipuri/Meitei, Khasi, Mizo  (NER — required)
//
// Each language has:
//   - code        : ISO-ish identifier
//   - name        : English display name
//   - native      : native-script display name
//   - speechLocale: BCP-47 locale for Web Speech API (TTS/STT). Some NER
//                   languages have no stable browser voice; we still list
//                   the locale and gracefully fall back to English when the
//                   platform has no voice.

import { useApp } from "./store";

export type LanguageCode =
  | "en"
  | "kn"
  | "hi"
  | "ta"
  | "te"
  | "as" // Assamese
  | "bn" // Bengali
  | "mni" // Manipuri / Meitei
  | "kh" // Khasi
  | "lus"; // Mizo

export interface LanguageDef {
  code: LanguageCode;
  name: string;
  native: string;
  speechLocale: string;
  /** true if most browsers ship a voice for this locale */
  voiceLikely: boolean;
  /** group used for badges / ordering */
  group: "common" | "ner";
}

export const LANGUAGES: LanguageDef[] = [
  { code: "en", name: "English", native: "English", speechLocale: "en-IN", voiceLikely: true, group: "common" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", speechLocale: "kn-IN", voiceLikely: true, group: "common" },
  { code: "hi", name: "Hindi", native: "हिन्दी", speechLocale: "hi-IN", voiceLikely: true, group: "common" },
  { code: "ta", name: "Tamil", native: "தமிழ்", speechLocale: "ta-IN", voiceLikely: true, group: "common" },
  { code: "te", name: "Telugu", native: "తెలుగు", speechLocale: "te-IN", voiceLikely: true, group: "common" },
  { code: "as", name: "Assamese", native: "অসমীয়া", speechLocale: "as-IN", voiceLikely: false, group: "ner" },
  { code: "bn", name: "Bengali", native: "বাংলা", speechLocale: "bn-IN", voiceLikely: true, group: "ner" },
  { code: "mni", name: "Manipuri / Meitei", native: "মৈতৈ লোন্", speechLocale: "mni-IN", voiceLikely: false, group: "ner" },
  { code: "kh", name: "Khasi", native: "Khasi", speechLocale: "kha-IN", voiceLikely: false, group: "ner" },
  { code: "lus", name: "Mizo", native: "Mizo ṭawng", speechLocale: "lus-IN", voiceLikely: false, group: "ner" },
];

export function languageDef(code: LanguageCode): LanguageDef {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function speechLocaleFor(code: LanguageCode): string {
  return languageDef(code).speechLocale;
}

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
  "nav.recommendations": "Recommendations",
  "nav.settings": "Settings",
  "action.back": "Back",
  "action.continue": "Continue",
  "action.getStarted": "Get Started",
  "action.explore": "Explore Samsmarana",
  "action.startActivity": "Start Activity",
  "action.submit": "Submit",
  "action.next": "Next",
  "action.finish": "Finish",
  "action.retry": "Try Again",
  "action.standardActivity": "Continue with Standard Activity",
  "elder.welcome": "Welcome",
  "elder.whatNow": "What can I do now?",
  "voice.listen": "Listen",
  "voice.speak": "Speak your answer",
  "voice.listening": "Listening…",
  "voice.heard": "I heard",
  "voice.tryAgain": "Try Again",
  "voice.speed": "Voice speed",
  "voice.slow": "Slow",
  "voice.normal": "Normal",
  "video.preparing": "Preparing…",
  "video.generating": "Generating…",
  "video.almostReady": "Almost ready…",
  "video.unavailable":
    "Video generation is temporarily unavailable. You can continue with a standard activity.",
  "video.comingSoon": "Coming Soon",
  "video.watchPrompt": "Watch the short scene, then answer the questions.",
  "offline.offline": "Offline",
  "offline.syncing": "Syncing…",
  "offline.synced": "Synced",
  "offline.pending": "Sync pending. We'll retry when you're connected.",
  "stat.dayStreak": "Day streak",
  "stat.avgAccuracy": "Avg accuracy",
  "stat.activitiesToday": "Activities today",
  "stat.totalCompleted": "Total completed",
  "stat.avgResponse": "Avg response",
  "stat.completed": "Completed",
  "stat.pendingSync": "Pending sync",
  "elder.quickActivities": "Quick activities",
  "elder.cognitiveActivities": "Cognitive Activities",
  "elder.storyGames": "Story Games",
  "elder.cognitiveActivitiesDesc": "Visual memory activities — observe, then answer from memory.",
  "elder.storyGamesDesc": "Short visual stories designed around familiar everyday experiences. Watch the story, then answer memory questions.",
  "elder.todaysSession": "Today's session",
  "activity.start": "Start",
  "activity.read": "Read",
  "activity.playStory": "Play story",
  "activity.watchSequence": "Watch the sequence",
  "activity.video": "Video",
  "activity.personalizedVideo": "Personalized Video",
  "activity.tryAnother": "Try another activity",
  "activity.tryAgain": "Try again",
  "activity.done": "Done",
  "activity.continue": "Continue",
  "activity.iveSeenIt": "I've seen it",
  "activity.nextEvent": "Next event",
  "activity.answerQuestions": "Answer questions",
  "activity.nextScene": "Next scene",
  "activity.nextQuestion": "Next question",
  "activity.seeResults": "See results",
  "activity.startVisualActivity": "Start visual activity",
  "activity.lookCarefully": "Look carefully",
  "activity.takeYourTime": "Take your time…",
  "activity.rememberWhatYouSaw": "Now, remember what you saw",
  "activity.sceneHidden": "The scene is hidden. Answer from memory.",
  "activity.questionOf": "Question",
  "of": "of",
  "scene": "Scene",
  "event": "Event",
  "cognitiveSkillPracticed": "Cognitive skill practiced",
  "wellDone": "Well done!",
  "niceEffort": "Nice effort.",
  "thatsOkay": "That's okay. Let's try another one.",
  "accuracy": "Accuracy",
  "time": "Time",
  "score": "Score",
  "phase.observe": "Observe",
  "phase.remember": "Remember",
  "phase.answer": "Answer",
  "phase.feedback": "Feedback",
  "back.toActivities": "Back to activities",
  "back.toStoryGames": "Back to Story Games",
  "back.toHome": "Back to home",
  "profile.title": "Profile",
  "profile.desc": "Adjust language, region and interests anytime.",
  "profile.name": "Name",
  "profile.age": "Age",
  "profile.language": "Language",
  "profile.regionGroup": "Region group",
  "profile.state": "State",
  "profile.interests": "Interests",
  "profile.signOut": "Sign out",
  "profile.saveChanges": "Save changes",
  "reminders.title": "Reminders",
  "reminders.desc": "Gentle reminders only — never medical advice.",
  "reminders.add": "Add",
  "reminders.type": "Type",
  "reminders.title_field": "Title",
  "reminders.time": "Time",
  "reminders.save": "Save",
  "reminders.cancel": "Cancel",
  "reminders.remove": "Remove",
  "reminders.noReminders": "No reminders yet.",
  "reminders.everyDay": "Every day",
  "progress.title": "Progress",
  "progress.desc": "A factual, non-diagnostic view of recent engagement.",
  "progress.dayStreak": "Day streak",
  "progress.avgAccuracy": "Avg accuracy",
  "progress.totalCompleted": "Total completed",
  "progress.last7": "Last 7 days",
  "progress.recent": "Recent activity",
  "progress.noActivities": "No activities yet — try one from the Home tab.",
  "caregiver.dashboard": "Caregiver dashboard",
  "caregiver.supporting": "Supporting",
  "caregiver.familyEngagement": "Family Engagement",
  "caregiver.overview": "Overview",
  "caregiver.activityHistory": "Activity History",
  "caregiver.performance": "Performance",
  "caregiver.recommendations": "Recommendations",
  "caregiver.reminders": "Reminders",
  "caregiver.observations": "Observations",
  "caregiver.metrics.avgAccuracy": "Avg accuracy",
  "caregiver.metrics.avgResponse": "Avg response",
  "caregiver.metrics.completed": "Completed",
  "caregiver.metrics.pendingSync": "Pending sync",
  "caregiver.byCategory": "By category",
  "caregiver.last7": "Last 7 days",
  "caregiver.recentActivity": "Recent activity",
  "caregiver.noActivity": "No activities recorded yet.",
  "caregiver.notEnoughData": "Not enough data yet.",
  "caregiver.adaptiveRec": "Adaptive recommendation",
  "caregiver.nextSuggested": "Next suggested",
  "caregiver.level": "Level",
  "caregiver.open": "Open",
  "family.title": "Family Engagement",
  "family.warmMoments": "Warm moments for",
  "family.separateFromCaregiver": "separate from caregiver analytics.",
  "family.shareMoment": "Share a moment",
  "family.from": "From",
  "family.type": "Type",
  "family.message": "Message",
  "family.send": "Send",
  "family.messagesFromFamily": "Messages from family",
  "family.sharedMemories": "Shared memories",
  "family.upcomingOccasions": "Upcoming occasions",
  "family.familyStaysConnected": "Family stays connected",
  "family.noMoments": "No family moments yet. Share the first one.",
  "family.empty": "No messages yet.",
  "landing.tagline": "Personalized cognitive engagement for older adults",
  "landing.headline": "Memories deserve to be nurtured.",
  "landing.supporting": "Samsmarana creates personalized, culturally familiar activities that help older adults stay engaged, connected and curious.",
  "landing.getStarted": "Get Started",
  "landing.explore": "Explore Samsmarana",
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
  "voice.listen": "ಆಲಿಸಿ",
  "voice.speak": "ನಿಮ್ಮ ಉತ್ತರ ಹೇಳಿ",
  "voice.listening": "ಆಲಿಸುತ್ತಿದ್ದೇನೆ…",
  "voice.heard": "ನಾನು ಕೇಳಿದ್ದು",
  "offline.offline": "ಆಫ್‌ಲೈನ್",
  "offline.syncing": "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ…",
  "offline.synced": "ಸಿಂಕ್ ಆಯಿತು",
  "stat.dayStreak": "ದಿನದ ಸರಣಿ",
  "stat.avgAccuracy": "ಸರಾಸರಿ ನಿಖರತೆ",
  "stat.activitiesToday": "ಇಂದಿನ ಚಟುವಟಿಕೆಗಳು",
  "elder.quickActivities": "ತ್ವರಿತ ಚಟುವಟಿಕೆಗಳು",
  "elder.cognitiveActivities": "ಜ್ಞಾನಾತ್ಮಕ ಚಟುವಟಿಕೆಗಳು",
  "elder.storyGames": "ಕಥೆ ಆಟಗಳು",
  "elder.todaysSession": "ಇಂದಿನ ಸೆಷನ್",
  "activity.start": "ಪ್ರಾರಂಭಿಸಿ",
  "activity.read": "ಓದಿ",
  "activity.playStory": "ಕಥೆ ಆಡಿ",
  "activity.continue": "ಮುಂದುವರಿಸಿ",
  "activity.iveSeenIt": "ನೋಡಿದ್ದೇನೆ",
  "activity.answerQuestions": "ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ",
  "activity.nextQuestion": "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
  "activity.seeResults": "ಫಲಿತಾಂಶ ನೋಡಿ",
  "activity.tryAgain": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  "activity.tryAnother": "ಇನ್ನೊಂದು ಚಟುವಟಿಕೆ ಪ್ರಯತ್ನಿಸಿ",
  "activity.lookCarefully": "ಎಚ್ಚರಿಕೆಯಿಂದ ನೋಡಿ",
  "activity.takeYourTime": "ನಿಮ್ಮ ಸಮಯ ತೆಗೆದುಕೊಳ್ಳಿ…",
  "activity.sceneHidden": "ದೃಶ್ಯವನ್ನು ಮರೆಮಾಡಲಾಗಿದೆ. ನೆನಪಿನಿಂದ ಉತ್ತರಿಸಿ.",
  "wellDone": "ಸರಾಸರಿ!",
  "niceEffort": "ಒಳ್ಳೆಯ ಪ್ರಯತ್ನ.",
  "thatsOkay": "ಪರವಾಗಿಲ್ಲ. ಇನ್ನೊಂದನ್ನು ಪ್ರಯತ್ನಿಸೋಣ.",
  "accuracy": "ನಿಖರತೆ",
  "time": "ಸಮಯ",
  "score": "ಅಂಕ",
  "phase.observe": "ಗಮನಿಸಿ",
  "phase.remember": "ನೆನಪಿಡಿ",
  "phase.answer": "ಉತ್ತರ",
  "phase.feedback": "ಪ್ರತಿಕ್ರಿಯೆ",
  "back.toActivities": "ಚಟುವಟಿಕೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
  "profile.title": "ಪ್ರೊಫೈಲ್",
  "profile.language": "ಭಾಷೆ",
  "profile.signOut": "ಸೈನ್ ಔಟ್",
  "profile.saveChanges": "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
  "reminders.title": "ಜ್ಞಾಪನೆಗಳು",
  "reminders.add": "ಸೇರಿಸಿ",
  "progress.title": "ಪ್ರಗತಿ",
  "caregiver.dashboard": "ಆರೈಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "family.title": "ಕುಟುಂಬ ನಿಶ್ಚಿತಾರ್ಥ",
  "landing.getStarted": "ಪ್ರಾರಂಭಿಸಿ",
  "landing.explore": "ಸಂಸ್ಮರಣ ಅನ್ವೇಷಿಸಿ",
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
  "voice.listen": "सुनें",
  "voice.speak": "अपना उत्तर बोलें",
  "voice.listening": "सुन रहा हूँ…",
  "voice.heard": "मैंने सुना",
  "offline.offline": "ऑफ़लाइन",
  "offline.syncing": "सिंक हो रहा है…",
  "offline.synced": "सिंक हो गया",
  "stat.dayStreak": "दिन की श्रृंखला",
  "stat.avgAccuracy": "औसत सटीकता",
  "stat.activitiesToday": "आज की गतिविधियाँ",
  "elder.quickActivities": "त्वरित गतिविधियाँ",
  "elder.cognitiveActivities": "संज्ञानात्मक गतिविधियाँ",
  "elder.storyGames": "कहानी खेल",
  "elder.todaysSession": "आज का सत्र",
  "activity.start": "शुरू करें",
  "activity.read": "पढ़ें",
  "activity.playStory": "कहानी चलाएँ",
  "activity.continue": "जारी रखें",
  "activity.iveSeenIt": "देख लिया",
  "activity.answerQuestions": "प्रश्नों के उत्तर दें",
  "activity.nextQuestion": "अगला प्रश्न",
  "activity.seeResults": "परिणाम देखें",
  "activity.tryAgain": "पुनः प्रयास करें",
  "activity.tryAnother": "एक और गतिविधि आज़माएँ",
  "activity.lookCarefully": "ध्यान से देखें",
  "activity.takeYourTime": "अपना समय लें…",
  "activity.sceneHidden": "दृश्य छिपा हुआ है। याददाश्त से उत्तर दें।",
  "wellDone": "शाबाश!",
  "niceEffort": "अच्छा प्रयास।",
  "thatsOkay": "ठीक है। एक और आज़माएँ।",
  "accuracy": "सटीकता",
  "time": "समय",
  "score": "अंक",
  "phase.observe": "देखें",
  "phase.remember": "याद रखें",
  "phase.answer": "उत्तर",
  "phase.feedback": "प्रतिक्रिया",
  "back.toActivities": "गतिविधियों पर वापस",
  "profile.title": "प्रोफ़ाइल",
  "profile.language": "भाषा",
  "profile.signOut": "साइन आउट",
  "profile.saveChanges": "बदलाव सहेजें",
  "reminders.title": "रिमाइंडर",
  "reminders.add": "जोड़ें",
  "progress.title": "प्रगति",
  "caregiver.dashboard": "देखभालकर्ता डैशबोर्ड",
  "family.title": "परिवार संलग्नता",
  "landing.getStarted": "शुरू करें",
  "landing.explore": "संस्मरण खोजें",
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
  "voice.listen": "கேளுங்கள்",
  "voice.speak": "உங்கள் பதிலைச் சொல்லுங்கள்",
  "voice.listening": "கேட்கிறேன்…",
  "voice.heard": "நான் கேட்டது",
  "offline.offline": "ஆஃப்லைன்",
  "offline.synced": "ஒத்திசைக்கப்பட்டது",
  "stat.dayStreak": "நாள் தொடர்",
  "stat.avgAccuracy": "சராசரி துல்லியம்",
  "stat.activitiesToday": "இன்றைய செயல்பாடுகள்",
  "elder.quickActivities": "விரைவு செயல்பாடுகள்",
  "elder.cognitiveActivities": "அறிவாற்றல் செயல்பாடுகள்",
  "elder.storyGames": "கதை விளையாட்டுகள்",
  "elder.todaysSession": "இன்றைய அமர்வு",
  "activity.start": "தொடங்கு",
  "activity.read": "படி",
  "activity.playStory": "கதை விளையாடு",
  "activity.continue": "தொடரவும்",
  "activity.iveSeenIt": "பார்த்தேன்",
  "activity.answerQuestions": "கேள்விகளுக்கு பதிலளி",
  "activity.nextQuestion": "அடுத்த கேள்வி",
  "activity.seeResults": "முடிவுகளைப் பார்",
  "activity.tryAgain": "மீண்டும் முயற்சி",
  "activity.tryAnother": "மற்றொரு செயல்பாட்டை முயற்சி",
  "activity.lookCarefully": "கவனமாகப் பார்",
  "activity.takeYourTime": "உங்கள் நேரம் எடுத்துக்கொள்ளுங்கள்…",
  "activity.sceneHidden": "காட்சி மறைக்கப்பட்டது. நினைவிலிருந்து பதிலளி.",
  "wellDone": "சரியாக!",
  "niceEffort": "நல்ல முயற்சி.",
  "thatsOkay": "பரவாயில்லை. மற்றொன்றை முயற்சி.",
  "accuracy": "துல்லியம்",
  "time": "நேரம்",
  "score": "மதிப்பெண்",
  "phase.observe": "கவனி",
  "phase.remember": "நினைவில் கொள்",
  "phase.answer": "பதில்",
  "phase.feedback": "கருத்து",
  "back.toActivities": "செயல்பாடுகளுக்குத் திரும்பு",
  "profile.title": "சுயவிவரம்",
  "profile.language": "மொழி",
  "profile.signOut": "வெளியேறு",
  "profile.saveChanges": "மாற்றங்களைச் சேமி",
  "reminders.title": "நினைவூட்டல்கள்",
  "reminders.add": "சேர்",
  "progress.title": "முன்னேற்றம்",
  "caregiver.dashboard": "பராமரிப்பாளர் டாஷ்போர்டு",
  "family.title": "குடும்ப ஈடுபாடு",
  "landing.getStarted": "தொடங்குக",
  "landing.explore": "சம்ஸ்மரணவை ஆராயுங்கள்",
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
  "voice.listen": "వినండి",
  "voice.speak": "మీ సమాధానం చెప్పండి",
  "voice.listening": "వింటున్నాను…",
  "voice.heard": "నేను విన్నది",
  "offline.offline": "ఆఫ్‌లైన్",
  "offline.synced": "సమకాలీకరించబడింది",
  "stat.dayStreak": "రోజు వరుస",
  "stat.avgAccuracy": "సగటు ఖచ్చితత్వం",
  "stat.activitiesToday": "నేటి కార్యకలాపాలు",
  "elder.quickActivities": "త్వరిత కార్యకలాపాలు",
  "elder.cognitiveActivities": "జ్ఞానాత్మక కార్యకలాపాలు",
  "elder.storyGames": "కథా ఆటలు",
  "elder.todaysSession": "నేటి సెషన్",
  "activity.start": "ప్రారంభించు",
  "activity.read": "చదవండి",
  "activity.playStory": "కథ ఆడండి",
  "activity.continue": "కొనసాగించు",
  "activity.iveSeenIt": "చూశాను",
  "activity.answerQuestions": "ప్రశ్నలకు సమాధానం",
  "activity.nextQuestion": "తదుపరి ప్రశ్న",
  "activity.seeResults": "ఫలితాలు చూడండి",
  "activity.tryAgain": "మళ్ళీ ప్రయత్నించండి",
  "activity.tryAnother": "మరొక కార్యకలాపం ప్రయత్నించండి",
  "activity.lookCarefully": "జాగ్రత్తగా చూడండి",
  "activity.takeYourTime": "మీ సమయం తీసుకోండి…",
  "activity.sceneHidden": "దృశ్యం దాచబడింది. జ్ఞాపకం నుండి సమాధానం.",
  "wellDone": "శభాష్!",
  "niceEffort": "మంచి ప్రయత్నం.",
  "thatsOkay": "పర్వాలేదు. మరొకటి ప్రయత్నిద్దాం.",
  "accuracy": "ఖచ్చితత్వం",
  "time": "సమయం",
  "score": "స్కోర్",
  "phase.observe": "గమనించు",
  "phase.remember": "గుర్తుంచుకో",
  "phase.answer": "సమాధానం",
  "phase.feedback": "స్పందన",
  "back.toActivities": "కార్యకలాపాలకు తిరిగి",
  "profile.title": "ప్రొఫైల్",
  "profile.language": "భాష",
  "profile.signOut": "సైన్ అవుట్",
  "profile.saveChanges": "మార్పులను సేవ్ చేయి",
  "reminders.title": "రిమైండర్‌లు",
  "reminders.add": "జోడించు",
  "progress.title": "పురోగతి",
  "caregiver.dashboard": "సంరక్షకుడి డాష్‌బోర్డ్",
  "family.title": "కుటుంబ నిమగ్నత",
  "landing.getStarted": "ప్రారంభించండి",
  "landing.explore": "సంస్మరణ అన్వేషించండి",
};

// NER languages — partial dictionaries with English fallback.
// (The architecture is complete; full translations can be added per locale.)
const as: Dict = {
  "app.tagline": "স্মৃতি আৰু জ্ঞানাত্মক সংলগ্নতা",
  "nav.home": "ঘৰ",
  "nav.activities": "কাৰ্য্য",
  "nav.reminders": "স্মাৰক",
  "action.getStarted": "আৰম্ভ কৰক",
  "action.back": "উভতি যাওক",
  "elder.welcome": "স্বাগতম",
  "voice.listen": "শুনক",
  "voice.speak": "আপোনাৰ উত্তৰ কওক",
  "voice.listening": "শুনি আছোঁ…",
  "offline.offline": "অফলাইন",
  "offline.synced": "ছিংক হ'ল",
};
const bn: Dict = {
  "app.tagline": "স্মৃতি ও জ্ঞানাত্মক সংযোজন",
  "nav.home": "হোম",
  "nav.activities": "কার্যকলাপ",
  "nav.reminders": "রিমাইন্ডার",
  "action.getStarted": "শুরু করুন",
  "action.back": "ফিরে যান",
  "elder.welcome": "স্বাগতম",
  "voice.listen": "শুনুন",
  "voice.speak": "আপনার উত্তর বলুন",
  "voice.listening": "শুনছি…",
  "offline.offline": "অফলাইন",
  "offline.synced": "সিঙ্ক হয়েছে",
};
const mni: Dict = {
  "app.tagline": "Memory & Cognitive Engagement",
  "nav.home": "Home",
  "action.getStarted": "Start",
  "action.back": "Back",
  "elder.welcome": "Welcome",
  "voice.listen": "Listen",
  "voice.speak": "Speak your answer",
  "voice.listening": "Listening…",
  "offline.offline": "Offline",
};
const kh: Dict = {
  "app.tagline": "Memory & Cognitive Engagement",
  "nav.home": "Home",
  "action.getStarted": "Start",
  "action.back": "Back",
  "elder.welcome": "Welcome",
  "voice.listen": "Listen",
  "voice.speak": "Speak your answer",
  "voice.listening": "Listening…",
  "offline.offline": "Offline",
};
const lus: Dict = {
  "app.tagline": "Memory & Cognitive Engagement",
  "nav.home": "Home",
  "action.getStarted": "Start",
  "action.back": "Back",
  "elder.welcome": "Welcome",
  "voice.listen": "Listen",
  "voice.speak": "Speak your answer",
  "voice.listening": "Listening…",
  "offline.offline": "Offline",
};

const DICTS: Record<LanguageCode, Dict> = { en, kn, hi, ta, te, as, bn, mni, kh, lus };

export function t(lang: LanguageCode, key: string): string {
  const d = DICTS[lang] ?? en;
  // Fall back to English, then to the key itself — NEVER undefined/null/raw.
  return d[key] ?? en[key] ?? key;
}

export function languageLabel(code: LanguageCode): string {
  return languageDef(code).name;
}
export function languageNative(code: LanguageCode): string {
  return languageDef(code).native;
}

/**
 * React hook that returns a translation function bound to the current user's
 * selected language. Reads the language from the profile in the Zustand
 * store, so switching language in the Profile tab (and saving) immediately
 * re-renders any component using this hook with the new language.
 *
 * Usage:
 *   const t = useT();
 *   <h1>{t("elder.welcome")}</h1>
 */
export function useT(): (key: string) => string {
  const lang = useApp((s) => s.profile?.language ?? "en") as LanguageCode;
  return (key: string) => t(lang, key);
}

/** A translated string with its English caption (when the language is not English). */
export interface CaptionedText {
  text: string;
  caption: string | null;
}

/**
 * React hook that returns a function producing captioned text: the selected
 * language's translation as the primary text, and the English translation as
 * a smaller caption underneath (only when the selected language is not English).
 *
 * Usage:
 *   const tc = useTC();
 *   <h1>{tc("elder.welcome").text}</h1>
 *   {tc("elder.welcome").caption && <p className="text-xs">{tc("elder.welcome").caption}</p>}
 */
export function useTC(): (key: string) => CaptionedText {
  const lang = useApp((s) => s.profile?.language ?? "en") as LanguageCode;
  return (key: string): CaptionedText => {
    const text = t(lang, key);
    const caption = lang !== "en" ? t("en", key) : null;
    // If the translation fell back to English (no native translation exists),
    // don't show a redundant English caption.
    if (caption !== null && text === caption) return { text, caption: null };
    return { text, caption };
  };
}

/**
 * Get the current user's language code (for non-React contexts).
 */
export function currentLanguage(): LanguageCode {
  try {
    return (useApp.getState().profile?.language ?? "en") as LanguageCode;
  } catch {
    return "en";
  }
}
