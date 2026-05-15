export const API_BASE_URL = "https://api.freeapi.app/api/v1";
export const BOOKMARK_MILESTONE = 5;
export const INACTIVITY_HOURS = 24;

export const STORAGE_KEYS = {
  accessToken: "learnflow.accessToken",
  refreshToken: "learnflow.refreshToken",
  user: "learnflow.user",
  bookmarks: "learnflow.bookmarks",
  enrollments: "learnflow.enrollments",
  preferences: "learnflow.preferences",
  lastOpenedAt: "learnflow.lastOpenedAt",
  bookmarkMilestoneSent: "learnflow.bookmarkMilestoneSent",
  notificationPermissionAsked: "learnflow.notificationPermissionAsked"
} as const;

export function localAvatarKey(userEmail: string) {
  return `learnflow.localAvatar.${userEmail}`;
}
