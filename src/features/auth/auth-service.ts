import type { ApiEnvelope, AuthSession, AuthUser } from "@/types/models";

import api from "@/lib/api";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  username: string;
};

type AuthResponse = {
  user?: {
    _id?: string;
    id?: string | number;
    fullName?: string;
    username?: string;
    email: string;
    avatar?: { url?: string } | string;
  };
  accessToken?: string;
  refreshToken?: string;
};

function mapUser(payload: AuthResponse["user"], fallback: { email: string; name?: string }) {
  const avatar =
    typeof payload?.avatar === "string" ? payload.avatar : payload?.avatar?.url;

  return {
    id: String(payload?._id ?? payload?.id ?? fallback.email),
    email: payload?.email ?? fallback.email,
    name: payload?.fullName ?? payload?.username ?? fallback.name ?? fallback.email.split("@")[0],
    avatar
  } satisfies AuthUser;
}

function mapAuthResponse(payload: AuthResponse, fallback: { email: string; name?: string }) {
  return {
    user: mapUser(payload.user, fallback),
    accessToken: payload.accessToken ?? "",
    refreshToken: payload.refreshToken
  } satisfies AuthSession;
}

export async function loginRequest(input: LoginInput) {
  const response = await api.post<ApiEnvelope<AuthResponse>>("/users/login", input);
  return mapAuthResponse(response.data.data, { email: input.email });
}

export async function registerRequest(input: RegisterInput) {
  const payload = {
    email: input.email,
    password: input.password,
    fullName: input.fullName,
    username: input.username
  };

  const response = await api.post<ApiEnvelope<AuthResponse>>("/users/register", {
    ...payload
  });

  return mapAuthResponse(response.data.data, {
    email: input.email,
    name: input.fullName
  });
}

export async function refreshTokenRequest(refreshToken?: string) {
  if (!refreshToken) {
    return null;
  }

  const response = await api.post<ApiEnvelope<AuthResponse>>("/users/refresh-token", {
    refreshToken
  });

  return mapAuthResponse(response.data.data, {
    email: response.data.data.user?.email ?? "restored@learnflow.app"
  });
}
