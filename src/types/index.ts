// Shared domain types for RAMSmith documents.

export type RiskBand = "Low" | "Medium" | "High";

export interface RamsHazard {
  id: string;
  category: string;
  hazard: string;
  whoAtRisk: string;
  controls: string[];
  // 1–5 scales
  likelihood: number;
  severity: number;
  // residual (after controls) — defaults lower than initial
  residualLikelihood: number;
  residualSeverity: number;
}

export interface LoadItem {
  id: string;
  description: string;
  quantity: number;
  weightKg: number; // per-unit weight
}

export interface LoadPlan {
  vehicle: string; // e.g. "18t Curtainsider"
  payloadCapacityKg: number; // capacity of the chosen vehicle
  items: LoadItem[];
  notes: string;
}

export interface DocumentContent {
  hazards: RamsHazard[];
  loadPlan: LoadPlan;
  methodSteps: string[];
}

// Library entry used to seed the guided form's hazard picker.
export interface HazardTemplate {
  category: string;
  hazard: string;
  whoAtRisk: string;
  controls: string[];
  likelihood: number;
  severity: number;
  residualLikelihood: number;
  residualSeverity: number;
}

export interface VehiclePreset {
  name: string;
  payloadCapacityKg: number;
}
