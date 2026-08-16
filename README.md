# Mochi

> **Mochi** is a shape-shifting AI companion that mirrors your feelings, roleplays hard conversations you're dreading, and sits beside you while you focus — so wellness support feels like company, not advice.

---

## Features

* **Mirror Mode (AI Voice Reflection)**
  Share how you feel via text or live voice chat. Mochi detects your emotional tone in real-time, shifts her SVG body expression across 20+ moods (happy, blooming, anxious, deeply sad, etc.), and responds in a photorealistic, comforting neural voice.

* **Rehearsal Mode (Hard Conversation Roleplay)**
  Practice dread-inducing real-world conversations—like asking for a raise or setting boundaries with a roommate. Mochi plays the counterpart, then provides a confidence score and constructive communication feedback.

* **Beside You (Virtual Body-Doubling)**
  Conquer task paralysis and study isolation. Choose a focus timer (5 min to 60 min Pomodoro) with ambient Lofi beats, while Mochi quietly types on her laptop beside you.

* **Mochidle Daily Game**
  A daily Wordle-style 5-letter wellness word game. Solve the word in 3 or fewer tries to unlock rare Special Mochi character prizes (Chef, Doctor, Sensei, Artist, Astronaut)!

* **Emotional Timeline & AI Insights**
  Track your emotional growth and focus history over time. Dynamic AI recommendation cards analyze your recent mood trends to provide science-backed self-care guidance.

* **Focus Streaks & Outfit Collection**
  Build consistent daily habits to maintain your focus streak, earn achievement badges, and grow your Special Mochi collection.

---

## How We Built It

1. **React Native, TypeScript, Expo, and Expo Router** for the cross-platform frontend and seamless file-based navigation across Mochi's core modes.
2. **Zustand and AsyncStorage** for offline-first persisted state management for user mood, companion base colors, focus streaks, unlocked outfits, and memory history.
3. **`react-native-svg` and `react-native-reanimated`** for Mochi's vector body rendering, dynamic facial expressions, outfit overlays, and smooth breathing/bobbing animations.
4. **Custom HSL colour math** so Mochi's active mood state gracefully shifts the user's chosen pastel base color (Lavender, Blush Pink, Soft Mint, Butter Yellow, Sky Blue, Peach).
5. **Vercel Serverless Functions & Google Gemini 2.5 Flash API** deployed on Vercel (`mochi-api`), executing three distinct jobs: real-time tone→mood emotion inference (20+ mood states), live persona roleplay for Rehearsal Mode, and personalized AI wellness insights.
6. **Embedded Mental Health Safety Guardrails** built directly into Gemini prompts to detect crisis signals, provide 988 Lifeline & 741741 Text Line referrals, prevent validation of harmful self-talk, and eliminate toxic positivity.
7. **Microsoft Edge Neural Speech (`msedge-tts` — `en-US-AvaNeural`)** deployed on Vercel serverless functions, streaming photorealistic, comforting female AI companion voice with zero credit cards or API keys required.
8. **`expo-file-system` and `expo-av`** for Base64 MP3 disk caching and loudspeaker audio session management, ensuring crisp, full-volume voice responses and ambient Lofi focus beats.
9. **Custom Mochidle Daily Game Engine** featuring 2-pass duplicate letter evaluation algorithms and Special Mochi character outfit unlocks for focus streaks.
10. **Supabase PostgreSQL and Auth** for secure user account sign-in and cloud database sync of check-ins, focus sessions, and timeline memories.

---

## Tech Stack Summary

* **Frontend**: React Native `0.81.5`, Expo SDK 54, TypeScript, Zustand, React Native Reanimated v4, React Native SVG, Expo AV, Expo FileSystem
* **AI Intelligence**: Google Gemini 2.5 Flash (`@google/genai`) with Mental Health Safety Guardrails
* **Voice Synthesis**: Microsoft Edge Neural Speech (`msedge-tts` — `en-US-AvaNeural`)
* **Backend API**: Node.js Serverless Functions deployed on Vercel (`mochi-api`)
* **Database & Auth**: Supabase PostgreSQL & Auth

---

## Repository Structure

```text
Mochi/
├── mochi/                   # Mobile Client Application (React Native / Expo)
│   ├── app/                 # Expo Router screens (index, mirror, rehearsal, beside, etc.)
│   ├── components/          # Modular component architecture (mirror/, rehearsal/, beside/, etc.)
│   ├── store/               # Zustand state management (mochiStore.ts)
│   └── assets/              # Audio, images, fonts, and videos
└── mochi-api/               # Serverless Backend API (Node.js / Vercel)
    └── api/                 # Endpoint functions (chat.js, tts.js, meme.js)
```

---

## Getting Started

### 1. Backend Setup (`mochi-api`)
```bash
cd mochi-api
npm install
# Add GEMINI_API_KEY to your environment variables
npm run dev
```

### 2. Frontend Setup (`mochi`)
```bash
cd mochi
npm install
npx expo start -c
```
Scan the QR code with **Expo Go** (Android/iOS) or press `w` to launch on Web.
