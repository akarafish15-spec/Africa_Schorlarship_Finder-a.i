import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "Rolling";
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(deadline?: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function deadlineUrgency(deadline?: string | null): "critical" | "upcoming" | "safe" | "none" {
  const days = daysUntil(deadline);
  if (days === null) return "none";
  if (days <= 7) return "critical";
  if (days <= 30) return "upcoming";
  return "safe";
}

export function matchScoreColor(score: number): string {
  if (score >= 75) return "text-primary";
  if (score >= 50) return "text-tertiary";
  return "text-on-surface-variant";
}

export function matchScoreRingClass(score: number): string {
  if (score >= 75) return "match-ring-high";
  if (score >= 50) return "match-ring-mid";
  return "match-ring-low";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatFundingType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
