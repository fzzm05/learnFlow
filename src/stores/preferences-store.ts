import { create } from "zustand";

import { STORAGE_KEYS } from "@/config/constants";
import { appStorage } from "@/lib/storage";

type PreferencesStore = {
  notificationsEnabled: boolean;
  lastOpenedAt: string | null;
  bookmarkMilestoneSent: boolean;
  hasAskedNotificationPermission: boolean;
  onboardingComplete: boolean;
  hydrate: () => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  updateLastOpenedAt: () => Promise<void>;
  setBookmarkMilestoneSent: (value: boolean) => Promise<void>;
  markNotificationPermissionAsked: () => Promise<void>;
  setOnboardingComplete: () => Promise<void>;
};

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  notificationsEnabled: false,
  lastOpenedAt: null,
  bookmarkMilestoneSent: false,
  hasAskedNotificationPermission: false,
  onboardingComplete: false,
  async hydrate() {
    const [preferences, lastOpenedAt, bookmarkMilestoneSent, asked, onboardingComplete] = await Promise.all([
      appStorage.getObject<{ notificationsEnabled?: boolean }>(STORAGE_KEYS.preferences),
      appStorage.getString(STORAGE_KEYS.lastOpenedAt),
      appStorage.getString(STORAGE_KEYS.bookmarkMilestoneSent),
      appStorage.getString(STORAGE_KEYS.notificationPermissionAsked),
      appStorage.getString("onboarding_complete")
    ]);

    set({
      notificationsEnabled: Boolean(preferences?.notificationsEnabled),
      lastOpenedAt,
      bookmarkMilestoneSent: bookmarkMilestoneSent === "true",
      hasAskedNotificationPermission: asked === "true",
      onboardingComplete: onboardingComplete === "true"
    });
  },
  async setNotificationsEnabled(value) {
    await appStorage.setObject(STORAGE_KEYS.preferences, { notificationsEnabled: value });
    set({ notificationsEnabled: value });
  },
  async updateLastOpenedAt() {
    const timestamp = new Date().toISOString();
    await appStorage.setString(STORAGE_KEYS.lastOpenedAt, timestamp);
    set({ lastOpenedAt: timestamp });
  },
  async setBookmarkMilestoneSent(value) {
    await appStorage.setString(STORAGE_KEYS.bookmarkMilestoneSent, String(value));
    set({ bookmarkMilestoneSent: value });
  },
  async markNotificationPermissionAsked() {
    await appStorage.setString(STORAGE_KEYS.notificationPermissionAsked, "true");
    set({ hasAskedNotificationPermission: true });
  },
  async setOnboardingComplete() {
    await appStorage.setString("onboarding_complete", "true");
    set({ onboardingComplete: true });
  }
}));
