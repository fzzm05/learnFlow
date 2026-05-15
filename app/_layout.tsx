import "../global.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState } from "react-native";

import { useHydrateApp } from "@/hooks/use-hydrate-app";
import { scheduleInactivityReminder } from "@/lib/notifications";
import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  useHydrateApp();

  const isHydrating = useAuthStore((state) => state.isHydrating);

  useEffect(() => {
    if (!isHydrating) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isHydrating]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void usePreferencesStore.getState().updateLastOpenedAt();
        void scheduleInactivityReminder();
      }
    });

    return () => subscription.remove();
  }, []);

  if (isHydrating) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" }
      }}
    />
  );
}
