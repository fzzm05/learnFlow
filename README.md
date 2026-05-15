# LearnFlow

LearnFlow is a Mini LMS mobile app built in `React Native Expo` for the House of EdTech assignment. It combines secure authentication, a native course catalog, embedded WebView content, local notifications, persistence, and resilient offline-aware UX.

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

## Known Limitations

- The FreeAPI auth endpoint shapes may vary slightly from the assumptions used here for `/users/login`, `/users/register`, and `/users/refresh-token`.
- Notification icon assets and store distribution polish are not finalized.
- README screenshots and demo video still need to be captured after running the app on device/emulator.

## Demo Checklist

- Show login or register
- Show catalog load, search, and pull-to-refresh
- Save 5+ courses to trigger a bookmark milestone
- Open course details and enroll
- Open the WebView content screen and show bridge communication
- Toggle offline mode and show the offline banner
