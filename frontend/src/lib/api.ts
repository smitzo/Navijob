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

export async function mutateApi<T = { detail: string }>(path: string, body: unknown = {}, method = "POST"): Promise<T> {
  const { csrfToken } = await getApi<{ csrfToken: string }>("auth/csrf/");
  const multipart = body instanceof FormData;
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    method,
    credentials: "same-origin",
    headers: { Accept: "application/json", "X-CSRFToken": csrfToken, ...(multipart ? {} : { "Content-Type": "application/json" }) },
    body: multipart ? body : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const fields: Record<string, string> = {};
    if (data && typeof data === "object") for (const [key, value] of Object.entries(data)) fields[key] = Array.isArray(value) ? value.join(" ") : String(value);
    throw new ApiError(typeof data?.detail === "string" ? data.detail : Object.values(fields)[0] || "We couldn’t save this change. Please try again.", response.status, fields);
  }
  return data as T;
}

export function safeReturnPath(value: string | null, role: "candidate" | "recruiter") {
  const fallback = role === "recruiter" ? "/recruiter" : "/candidate";
  if (!value || !/^\/(jobs|candidate|recruiter)(\/|\?|$)/.test(value) || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return fallback;
  if (role === "recruiter" && value.startsWith("/candidate")) return fallback;
  if (role === "candidate" && value.startsWith("/recruiter")) return fallback;
  return value;
}
