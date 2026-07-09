import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Kept self-contained (no @/ alias imports) so `tsx prisma/seed.ts` runs cleanly.

function ref(seq: number) {
  return `RA-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`;
}

const sampleHazards = [
  {
    id: "h1",
    category: "Working at Height",
    hazard: "Rigging and truss work from MEWPs and towers",
    whoAtRisk: "Riggers, crew below",
    controls: [
      "Only trained/competent persons work at height",
      "Harnesses and lanyards where fall risk exists; tools tethered",
      "Exclusion zone and hard-hat area beneath overhead work",
    ],
    likelihood: 4,
    severity: 5,
    residualLikelihood: 2,
    residualSeverity: 4,
  },
  {
    id: "h2",
    category: "Vehicles & Plant",
    hazard: "Forklift and telehandler movements in shared areas",
    whoAtRisk: "Crew, drivers",
    controls: [
      "Segregated pedestrian and vehicle routes with barriers",
      "Trained operators only; flashing beacons in use",
      "5mph site speed limit; banksman for reversing",
    ],
    likelihood: 4,
    severity: 4,
    residualLikelihood: 2,
    residualSeverity: 3,
  },
  {
    id: "h3",
    category: "Manual Handling",
    hazard: "Lifting flight cases and staging",
    whoAtRisk: "Crew, casual labour",
    controls: [
      "Team lifts for loads over 25kg; trolleys and tail-lifts used",
      "Manual handling briefing at induction",
    ],
    likelihood: 4,
    severity: 3,
    residualLikelihood: 2,
    residualSeverity: 2,
  },
];

const sampleSteps = [
  "Attend site induction and confirm the RAMS with all crew before work begins.",
  "Cordon the working area and establish segregated pedestrian and vehicle routes.",
  "Unload vehicles in reverse-rig order using trolleys and tail-lifts.",
  "Rig from the ground up, maintaining exclusion zones beneath overhead work.",
  "Inspect, sign off, and hand over; reverse the process for breakdown.",
];

const sampleLoadPlan = {
  vehicle: "18t Curtainsider",
  payloadCapacityKg: 9500,
  items: [
    { id: "l1", description: "Line array cabinets (pair, cased)", quantity: 8, weightKg: 190 },
    { id: "l2", description: "Truss — 3m box section", quantity: 12, weightKg: 42 },
    { id: "l3", description: "Flight case — control", quantity: 3, weightKg: 85 },
    { id: "l4", description: "Cable trunk", quantity: 6, weightKg: 110 },
  ],
  notes: "Heaviest items over the axles; strap every layer.",
};

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // --- Free demo user ---
  const demo = await prisma.user.upsert({
    where: { email: "demo@ramsmith.app" },
    update: {},
    create: {
      email: "demo@ramsmith.app",
      name: "Alex Rigger",
      company: "Northgate Event Services",
      passwordHash,
      plan: "FREE",
    },
  });

  // --- Active Solo subscriber (to preview the unlimited state) ---
  await prisma.user.upsert({
    where: { email: "pro@ramsmith.app" },
    update: {},
    create: {
      email: "pro@ramsmith.app",
      name: "Sam Producer",
      company: "Skyline Productions",
      passwordHash,
      plan: "SOLO",
      subscriptionStatus: "active",
      stripeCustomerId: "cus_demo_seed",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Sample documents for the demo user (only if they have none yet).
  const existing = await prisma.document.count({ where: { userId: demo.id } });
  if (existing === 0) {
    await prisma.document.create({
      data: {
        ref: ref(1),
        userId: demo.id,
        status: "APPROVED",
        title: "Main Stage Load-In & Rig",
        eventName: "Riverside Festival 2026",
        venue: "Victoria Park, London",
        client: "Riverside Live Ltd",
        siteDates: "Load-in 12 Aug · Show 13–14 · Out 15",
        preparedBy: "Alex Rigger",
        company: "Northgate Event Services",
        hazards: sampleHazards,
        loadPlan: sampleLoadPlan,
        methodSteps: sampleSteps,
      },
    });

    await prisma.document.create({
      data: {
        ref: ref(2),
        userId: demo.id,
        status: "DRAFT",
        title: "Corporate Gala — AV Get-In",
        eventName: "Meridian Annual Conference",
        venue: "ICC Birmingham",
        client: "Meridian Group",
        siteDates: "Get-in 03 Sep · Event 04 Sep · Out 04 Sep",
        preparedBy: "Alex Rigger",
        company: "Northgate Event Services",
        hazards: sampleHazards.slice(0, 2),
        loadPlan: {
          vehicle: "7.5t Box",
          payloadCapacityKg: 2800,
          items: [
            { id: "l1", description: "LED wall panels (cased)", quantity: 24, weightKg: 28 },
            { id: "l2", description: "Rigging bar & clamps", quantity: 8, weightKg: 32 },
          ],
          notes: "Panels loaded upright in dollies.",
        },
        methodSteps: sampleSteps.slice(0, 4),
      },
    });
  }

  console.log("Seed complete.");
  console.log("  Free user: demo@ramsmith.app / password123");
  console.log("  Solo user: pro@ramsmith.app  / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
