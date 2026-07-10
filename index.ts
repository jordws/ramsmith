// RAMSmith database schema
// Provider: PostgreSQL. Run `npm run db:push` to sync, `npm run db:seed` to seed.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Plan {
  FREE
  SOLO
  TEAM
}

enum SubStatus {
  none
  trialing
  active
  past_due
  canceled
  incomplete
}

enum DocStatus {
  DRAFT
  APPROVED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  company      String?
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // --- Billing / subscription state (updated by Stripe webhook) ---
  plan                 Plan      @default(FREE)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  subscriptionStatus   SubStatus @default(none)
  currentPeriodEnd     DateTime?

  documents Document[]

  @@index([stripeCustomerId])
}

model Document {
  id        String    @id @default(cuid())
  ref       String    @unique // human-facing reference, e.g. RA-2026-0007
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    DocStatus @default(DRAFT)

  // Job / event context
  title      String
  eventName  String
  venue      String
  client     String
  siteDates  String // free text, e.g. "Load-in 12 Aug, Show 13–14 Aug, Out 15 Aug"
  preparedBy String
  company    String

  // Structured content stored as JSON:
  //  hazards:   RamsHazard[]  (see src/types)
  //  methodSteps: string[]
  hazards     Json
  methodSteps Json

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
