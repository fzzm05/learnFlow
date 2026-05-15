import { useEffect } from "react";

import { prepareNotificationChannel, scheduleInactivityReminder } from "@/lib/notifications";
import { useAuthStore } from "@/stores/auth-store";
import { useCourseStore } from "@/stores/course-store";
import { usePreferencesStore } from "@/stores/preferences-store";

export function useHydrateApp() {
  useEffect(() => {
    async function bootstrap() {
      await prepareNotificationChannel();
      await Promise.all([
        usePreferencesStore.getState().hydrate(),
        useCourseStore.getState().hydrateLocalState(),
        useAuthStore.getState().restoreSession()
      ]);
      await usePreferencesStore.getState().updateLastOpenedAt();
      await scheduleInactivityReminder();
    }

    void bootstrap();
  }, []);
}
