import { MockStore } from "./mockData";

// Ensures mock store is seeded
MockStore.init();

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
export const USE_REAL_BACKEND = Boolean(API_BASE_URL);

/**
 * Simulates network latency for realistic loading states
 */
export async function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Unified request client supporting real HTTP when configured, or isolated mock provider.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (USE_REAL_BACKEND) {
    const token = MockStore.getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const data = await response.json();
        errorMsg = data.detail || data.message || errorMsg;
      } catch {
        // fallback
      }
      throw new ApiError(errorMsg, response.status);
    }

    return response.json();
  }

  throw new ApiError(`Endpoint not implemented in real client: ${endpoint}`, 501);
}
