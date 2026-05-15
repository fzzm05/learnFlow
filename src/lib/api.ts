import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/config/constants";
import { useAuthStore } from "@/stores/auth-store";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await useAuthStore.getState().refreshSession();

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        return api(originalRequest);
      }

      await useAuthStore.getState().logout();
    }

    throw error;
  }
);

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as
      | { message?: string; errors?: Array<Record<string, string>> }
      | undefined;

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    if (errorData?.errors?.length) {
      const flattened = errorData.errors
        .flatMap((item) => Object.values(item))
        .filter(Boolean)
        .join("\n");

      if (flattened) {
        return flattened;
      }
    }

    return (
      errorData?.message ??
      error.message ??
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export default api;
