import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  }
};

export const appStorage = {
  async setObject<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async getObject<T>(key: string): Promise<T | null> {
    const rawValue = await AsyncStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  },
  async setString(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  },
  async getString(key: string) {
    return AsyncStorage.getItem(key);
  },
  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  }
};
