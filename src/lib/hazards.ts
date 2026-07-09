import type { HazardTemplate, VehiclePreset } from "@/types";

/**
 * Starter hazard library for live event production.
 * Aligned to common UK HSE / CDM 2015 event-industry expectations.
 * Everything here is a sensible default the user edits per job — it is not
 * legal advice, and the app makes that clear on export.
 */
export const HAZARD_LIBRARY: HazardTemplate[] = [
  {
    category: "Manual Handling",
    hazard: "Lifting and moving flight cases, staging and heavy equipment",
    whoAtRisk: "Crew, casual labour",
    controls: [
      "Team lifts for loads over 25kg; use of trolleys and tail-lifts",
      "Manual handling briefing at induction",
      "Clear routes kept free of trip hazards during load-in/out",
    ],
    likelihood: 4,
    severity: 3,
    residualLikelihood: 2,
    residualSeverity: 2,
  },
  {
    category: "Working at Height",
    hazard: "Rigging, truss and working from MEWPs, ladders or towers",
    whoAtRisk: "Riggers, crew below",
    controls: [
      "Only trained/competent persons work at height",
      "Harnesses and lanyards where fall risk exists; tools tethered",
      "Exclusion zone and hard-hat area beneath overhead work",
      "Daily pre-use checks of access equipment",
    ],
    likelihood: 4,
    severity: 5,
    residualLikelihood: 2,
    residualSeverity: 4,
  },
  {
    category: "Lifting Operations",
    hazard: "Suspended loads from hoists, chain motors and cranes",
    whoAtRisk: "Riggers, crew, public",
    controls: [
      "Lifting plan and LOLER-inspected equipment in date",
      "No persons beneath suspended loads",
      "Appointed banksman for crane and telehandler lifts",
    ],
    likelihood: 3,
    severity: 5,
    residualLikelihood: 1,
    residualSeverity: 4,
  },
  {
    category: "Vehicles & Plant",
    hazard: "Forklift and telehandler movements in shared pedestrian areas",
    whoAtRisk: "Crew, public, drivers",
    controls: [
      "Segregated pedestrian and vehicle routes with barriers",
      "Trained/licensed operators only; flashing beacons in use",
      "5mph site speed limit; banksman for reversing",
    ],
    likelihood: 4,
    severity: 4,
    residualLikelihood: 2,
    residualSeverity: 3,
  },
  {
    category: "Electrical",
    hazard: "Temporary power distribution, generators and cabling",
    whoAtRisk: "Crew, public",
    controls: [
      "Installation and testing by competent electrician (BS 7909)",
      "RCD protection on all circuits; cables ramped or flown",
      "Generators sited away from public with fuel bunding",
    ],
    likelihood: 3,
    severity: 4,
    residualLikelihood: 1,
    residualSeverity: 3,
  },
  {
    category: "Slips, Trips & Falls",
    hazard: "Cabling, uneven ground and changing floor levels",
    whoAtRisk: "Crew, public",
    controls: [
      "Cable ramps and matting over walkways",
      "Adequate task and emergency lighting during build/breakdown",
      "Housekeeping regime; spills cleared immediately",
    ],
    likelihood: 4,
    severity: 2,
    residualLikelihood: 2,
    residualSeverity: 2,
  },
  {
    category: "Crowd & Public Interface",
    hazard: "Public in proximity to a live build or breakdown",
    whoAtRisk: "Public, crew",
    controls: [
      "Heras fencing / hoarding around the working area",
      "Deliveries and heavy moves scheduled outside public hours where possible",
      "Marshals at interface points",
    ],
    likelihood: 3,
    severity: 4,
    residualLikelihood: 2,
    residualSeverity: 3,
  },
  {
    category: "Noise",
    hazard: "Exposure to high sound levels during sound checks and shows",
    whoAtRisk: "Crew, performers",
    controls: [
      "Hearing protection available and worn in high-noise zones",
      "Noise exposure managed to Control of Noise at Work Regs 2005",
      "Rotation of tasks to limit exposure time",
    ],
    likelihood: 3,
    severity: 2,
    residualLikelihood: 2,
    residualSeverity: 2,
  },
  {
    category: "Weather (Outdoor)",
    hazard: "High winds, rain, lightning and heat affecting temporary structures",
    whoAtRisk: "Crew, public",
    controls: [
      "Wind management plan with hold/evacuate trigger speeds",
      "Structures signed off by competent temporary works coordinator",
      "Weather monitored; work suspended above safe thresholds",
    ],
    likelihood: 3,
    severity: 4,
    residualLikelihood: 2,
    residualSeverity: 3,
  },
  {
    category: "Fire",
    hazard: "Generators, hot works, pyrotechnics and combustible materials",
    whoAtRisk: "Crew, public, performers",
    controls: [
      "Extinguishers at generators and hot-work points; permit for hot works",
      "Pyro handled by qualified operator with dedicated risk assessment",
      "Clear escape routes and assembly points maintained",
    ],
    likelihood: 2,
    severity: 5,
    residualLikelihood: 1,
    residualSeverity: 4,
  },
  {
    category: "Fatigue",
    hazard: "Long shifts across load-in, show days and breakdown",
    whoAtRisk: "Crew, drivers",
    controls: [
      "Shift patterns planned with rest breaks; drivers within WTD limits",
      "Welfare, hydration and food provided on site",
      "Supervisors monitor for signs of fatigue",
    ],
    likelihood: 3,
    severity: 3,
    residualLikelihood: 2,
    residualSeverity: 2,
  },
  {
    category: "Ground Loading",
    hazard: "Outrigger and structure point loads on unknown ground",
    whoAtRisk: "Crew, public",
    controls: [
      "Ground bearing assessed; spreader plates sized to load",
      "Underground services located before ground penetration",
      "Structures kept clear of soft or made-up ground",
    ],
    likelihood: 2,
    severity: 4,
    residualLikelihood: 1,
    residualSeverity: 3,
  },
];

/** Distinct categories, for grouping the picker UI. */
export const HAZARD_CATEGORIES = Array.from(
  new Set(HAZARD_LIBRARY.map((h) => h.category))
);

/** Common vehicle presets so the load plan can flag overloads. */
export const VEHICLE_PRESETS: VehiclePreset[] = [
  { name: "Sprinter / LWB Van", payloadCapacityKg: 1200 },
  { name: "Luton with Tail-lift", payloadCapacityKg: 1000 },
  { name: "7.5t Box", payloadCapacityKg: 2800 },
  { name: "18t Curtainsider", payloadCapacityKg: 9500 },
  { name: "26t Rigid", payloadCapacityKg: 15500 },
  { name: "44t Artic (Tri-axle)", payloadCapacityKg: 27000 },
];
