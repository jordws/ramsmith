import type { RiskBand } from "@/types";

/** Risk score = likelihood x severity on 1–5 scales (max 25). */
export function riskScore(likelihood: number, severity: number): number {
  return likelihood * severity;
}

export function riskBand(score: number): RiskBand {
  if (score <= 6) return "Low";
  if (score <= 12) return "Medium";
  return "High";
}

export const BAND_HEX: Record<RiskBand, string> = {
  Low: "#12B76A",
  Medium: "#F79009",
  High: "#F04438",
};
