# LearnFlow

LearnFlow is a Mini LMS mobile app built in `React Native Expo` for the House of EdTech assignment. It combines secure authentication, a native course catalog, embedded WebView content, local notifications, persistence, and resilient offline-aware UX.

## 🚀 Live Preview & Build
**Android Preview Build:** [Install via Expo EAS](https://expo.dev/accounts/fzzm05/projects/learnflow/builds/e259e68e-eeb6-4e13-a49f-3c4a92941969)

## Stack

- `Expo SDK 55`
- `TypeScript` with strict mode
- `expo-router`
- `NativeWind`
- `Zustand`
- `Expo SecureStore`
- `AsyncStorage`
- `Axios`
- `react-native-webview`
- `expo-notifications`
- `expo-image`
- `React Hook Form + Zod`
- `Jest + React Native Testing Library`

## Features

- Login/register flow backed by `/api/v1/users/*`
- Secure token persistence and session restore
- Course catalog built from `randomusers` + `randomproducts`
- Search, pull-to-refresh, local bookmarks, and enrollment state
- Profile screen with picture picker and learning stats
- Embedded course content using `WebView` and a native bridge
- Local notifications for bookmark milestones and inactivity reminders
- Offline banner, timeout handling, and user-friendly failure states

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Expo app:

```bash
npm run start
```

3. Run tests:

```bash
npm test
```

## Build Notes

- For an Android dev build APK, use Expo EAS:

```bash
npx eas build -p android --profile development
```

- The assignment asks for an APK in the release flow. Add the built artifact to the repository release section before submission.

## Environment Variables

This implementation currently uses the public FreeAPI base URL directly:

- `https://api.freeapi.app/api/v1`

If you want to make this configurable later, introduce an Expo public env variable like `EXPO_PUBLIC_API_BASE_URL`.

## Architecture Decisions

- `SecureStore` is used only for auth tokens.
- `AsyncStorage` is used for bookmarks, enrollments, preferences, notification flags, and last-open timestamps.
- `Zustand` keeps state slices small and avoids Redux boilerplate for a fast but maintainable architecture.
- Course data is normalized before UI rendering so screens do not depend on raw API shapes.
- WebView content is generated from local HTML for deterministic demo behavior.


## Reasoning behind the Architectural Decisions

### 1. Performance-First Rendering with `LegendList`
Standard `FlatList` often struggles with complex UI and images in a large catalog. I implemented **LegendList** to ensure 60FPS scrolling. By utilizing `estimatedItemSize` and memoized components, the app achieves near-native performance for catalog browsing.
### 2. Resilient API Layer (Axios + Interceptors)
The networking layer in `src/lib/api.ts` isn't just a fetcher. It includes:
- **Automatic Token Refresh**: Interceptors handle 401 errors by attempting a silent refresh before failing.
- **Request Timeouts**: Strict 12s timeout to prevent "hanging" UI states.
- **Error Normalization**: A centralized utility converts raw API errors into user-friendly messages.
### 3. Secure State Persistence
- **Zustand**: Used for its atomic state slices and minimal boilerplate, keeping the business logic decoupled from the UI.
- **Dual-Storage Strategy**: I use **Expo SecureStore** for sensitive credentials (tokens) and **AsyncStorage** for non-sensitive data (bookmarks, local preferences), adhering to mobile security best practices.
### 4. Bidirectional WebView Bridge
Instead of a simple "viewer," the course content screen (`courses/[id]/content.tsx`) implements a secure bridge. It uses `onMessage` and `injectJavaScript` to synchronize course progress between the embedded HTML and the native app state.
---

