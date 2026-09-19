export class ApiError extends Error {
  constructor(message: string, public status: number, public fields: Record<string, string> = {}) { super(message); }
}

export async function getApi<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, { credentials: "same-origin", signal, headers: { Accept: "application/json" } });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(typeof data?.detail === "string" ? data.detail : "We couldn’t load this information. Please try again.", response.status);
  if (data === null) throw new ApiError("The server returned an unexpected response.", response.status);
  return data as T;
}

export type PageResult<T> = { count: number; results: T[]; next: string | null; previous: string | null };
export function asPage<T>(data: T[] | PageResult<T>): PageResult<T> {
  return Array.isArray(data) ? { count: data.length, results: data, next: null, previous: null } : data;
}
