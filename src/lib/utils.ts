import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatKg(kg: number) {
  return `${kg.toLocaleString("en-GB")} kg`;
}

/** Build a human-facing document reference, e.g. RA-2026-0007. */
export function makeRef(sequence: number) {
  const year = new Date().getFullYear();
  return `RA-${year}-${String(sequence).padStart(4, "0")}`;
}
