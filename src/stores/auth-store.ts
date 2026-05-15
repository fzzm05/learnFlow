import { create } from "zustand";

import { STORAGE_KEYS, localAvatarKey } from "@/config/constants";
import { loginRequest, refreshTokenRequest, registerRequest } from "@/features/auth/auth-service";
import { getErrorMessage } from "@/lib/api";
import { appStorage, secureStorage } from "@/lib/storage";
import { clearSessionPersistence, persistSession } from "@/lib/session-helpers";
import type { AuthSession, AuthUser } from "@/types/models";

type AuthStore = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  restoreSession: () => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<boolean>;
  register: (input: { email: string; password: string; fullName: string; username: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  clearAuthError: () => void;
  setSession: (session: AuthSession) => Promise<void>;
  setLocalAvatar: (uri: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrating: true,
  isAuthenticated: false,
  authError: null,
  clearAuthError: () => set({ authError: null }),
  async setSession(session) {
    await persistSession(session);
    // Restore any locally saved avatar for this user
    const localAvatar = await appStorage.getString(localAvatarKey(session.user.email));
    set({
      user: localAvatar ? { ...session.user, avatar: localAvatar } : session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken ?? null,
      isAuthenticated: Boolean(session.accessToken),
      authError: null
    });
  },
  async restoreSession() {
    set({ isHydrating: true });
    const [accessToken, refreshToken, user] = await Promise.all([
      secureStorage.getItem(STORAGE_KEYS.accessToken),
      secureStorage.getItem(STORAGE_KEYS.refreshToken),
      appStorage.getObject<AuthUser>(STORAGE_KEYS.user)
    ]);

    if (accessToken && user) {
      // Restore persisted local avatar override if present (keyed by email)
      const localAvatar = await appStorage.getString(localAvatarKey(user.email));
      set({
        user: localAvatar ? { ...user, avatar: localAvatar } : user,
        accessToken,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isHydrating: false
      });
      return;
    }

    set({
      isHydrating: false,
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null
    });
  },
  async login(input) {
    set({ authError: null });
    try {
      const session = await loginRequest(input);
      await get().setSession(session);
      return true;
    } catch (error) {
      set({ authError: getErrorMessage(error) });
      return false;
    }
  },
  async register(input) {
    set({ authError: null });
    try {
      const session = await registerRequest(input);
      await get().setSession(session);
      return true;
    } catch (error) {
      set({ authError: getErrorMessage(error) });
      return false;
    }
  },
  async logout() {
    await clearSessionPersistence();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      authError: null
    });
  },
  async refreshSession() {
    try {
      const refreshed = await refreshTokenRequest(get().refreshToken ?? undefined);
      if (!refreshed?.accessToken) {
        return false;
      }

      await persistSession(refreshed);
      set({
        user: refreshed.user,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken ?? null,
        isAuthenticated: true
      });
      return true;
    } catch {
      return false;
    }
  },
  async setLocalAvatar(uri) {
    const user = get().user;
    if (!user?.email) return;
    await appStorage.setString(localAvatarKey(user.email), uri);
    set({ user: { ...user, avatar: uri } });
  }
}));
