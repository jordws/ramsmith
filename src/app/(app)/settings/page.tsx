import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui";
import { SettingsForm } from "@/components/app/SettingsForm";
import { PLANS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Settings — RAMSmith" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="container-page py-8">
      <PageHeader eyebrow="Account" title="Settings" />

      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold">Profile</h2>
          <p className="mt-1 text-sm text-muted">
            This is the name and company shown on your exported documents.
          </p>
          <div className="mt-5">
            <SettingsForm
              initialName={user.name ?? ""}
              initialCompany={user.company ?? ""}
            />
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-display text-lg font-bold">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="label-mono">Email</dt>
              <dd className="mt-0.5">{user.email}</dd>
            </div>
            <div>
              <dt className="label-mono">Plan</dt>
              <dd className="mt-0.5">{PLANS[user.plan].name}</dd>
            </div>
            <div>
              <dt className="label-mono">Member since</dt>
              <dd className="mt-0.5">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-muted">
            Need to change your email or password? That&apos;s on the roadmap — contact
            support in the meantime.
          </p>
        </Card>
      </div>
    </div>
  );
}
