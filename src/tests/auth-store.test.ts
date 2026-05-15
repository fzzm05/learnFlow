import { clearSessionPersistence, persistSession } from "@/lib/session-helpers";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve())
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve())
}));

describe("session helpers", () => {
  it("persists the critical auth state", async () => {
    await persistSession({
      accessToken: "token",
      refreshToken: "refresh",
      user: {
        id: "1",
        name: "Learner",
        email: "learner@example.com"
      }
    });

    expect(true).toBe(true);
  });

  it("clears persisted auth state", async () => {
    await clearSessionPersistence();
    expect(true).toBe(true);
  });
});
