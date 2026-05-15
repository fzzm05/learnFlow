import { useEffect } from "react";

import { usePathname, useRouter, useSegments } from "expo-router";

import { useAuthStore } from "@/stores/auth-store";
import { usePreferencesStore } from "@/stores/preferences-store";

export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const onboardingComplete = usePreferencesStore((state) => state.onboardingComplete);

  useEffect(() => {
    if (isHydrating) {
      return;
    }

    const inAuth = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/onboarding");

    if (!isAuthenticated && !inAuth) {
      router.replace("/onboarding");
      return;
    }

    if (isAuthenticated) {
      if (!onboardingComplete && segments[1] !== "quiz") {
        router.replace("/(app)/quiz");
      } else if (inAuth) {
        router.replace(onboardingComplete ? "/(app)" : "/(app)/quiz");
      }
    }
  }, [isAuthenticated, isHydrating, onboardingComplete, pathname, router, segments]);
}
