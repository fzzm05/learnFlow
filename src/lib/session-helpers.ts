import { STORAGE_KEYS } from "@/config/constants";
import type { AuthSession } from "@/types/models";

import { appStorage, secureStorage } from "./storage";

export async function persistSession(session: AuthSession) {
  await Promise.all([
    secureStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken),
    secureStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken ?? ""),
    appStorage.setObject(STORAGE_KEYS.user, session.user)
  ]);
}

export async function clearSessionPersistence() {
  await Promise.all([
    secureStorage.removeItem(STORAGE_KEYS.accessToken),
    secureStorage.removeItem(STORAGE_KEYS.refreshToken),
    appStorage.removeItem(STORAGE_KEYS.user)
  ]);
}
