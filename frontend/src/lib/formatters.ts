import type { Job } from "./types";

export function formatSalary(job: Pick<Job, "currency" | "salary_min" | "salary_max" | "salary_period">) {
  const { currency, salary_min: low, salary_max: high, salary_period: period } = job;
  if (low === null && high === null) return "Salary not shared";
  if (currency === "INR" && period === "year" && (low ?? high ?? 0) >= 100000) {
    const lakh = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value / 100000);
    return `${low !== null ? lakh(low) : "Up to "}${high !== null && low !== null ? `–${lakh(high)}` : high !== null ? lakh(high) : "+"} LPA`;
  }
  const amount = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
  const range = low !== null && high !== null ? `${amount(low)}–${amount(high)}` : low !== null ? `${amount(low)}+` : `Up to ${amount(high!)}`;
  return `${currency} ${range} / ${period}`;
}

export function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

export function formatDate(value?: string | null) {
  if (!value) return "Not shared";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not shared" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(date);
}

export function safeExternalUrl(value?: string) {
  if (!value) return null;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : null; } catch { return null; }
}
