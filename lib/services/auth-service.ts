import type { User } from "@/lib/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return data as T;
}

export async function fetchSession(): Promise<User | null> {
  try {
    const data = await request<{ user: User | null }>("/api/auth/session");
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function signUpRequest(name: string, email: string, password: string) {
  return request<{ user: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function signInRequest(email: string, password: string) {
  return request<{ user: User }>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signOutRequest() {
  return request("/api/auth/signout", { method: "POST" });
}
