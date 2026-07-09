import Link from "next/link";
import { getUserWithUsage } from "@/server/user";
import { listDocuments } from "@/server/documents";
import { PageHeader } from "@/components/app/PageHeader";
import { UsageMeter } from "@/components/app/UsageMeter";
import { LinkButton, Card, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await getUserWithUsage();
  if (!data) redirect("/login");
  const { user, usage } = data;
  const docs = await listDocuments(user.id);
  const approved = docs.filter((d) => d.status === "APPROVED").length;

  return (
    <div className="container-page py-8">
      <PageHeader
        eyebrow={`Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        title="Dashboard"
        action={
          <LinkButton href="/documents/new" size="md">
            New document
          </LinkButton>
        }
      />

      {usage.atLimit ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-ink bg-ink px-5 py-4 text-white">
          <div>
            <p className="font-display font-bold">You&apos;ve used all 3 free documents.</p>
            <p className="text-sm text-white/70">Upgrade to Solo for unlimited documents.</p>
          </div>
          <LinkButton href="/billing" size="sm">Upgrade</LinkButton>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <UsageMeter used={usage.used} limit={usage.limit} planName={usage.plan.name} />
        <Card className="p-5">
          <span className="label-mono">Total documents</span>
          <div className="mt-2 font-display text-3xl font-extrabold">{docs.length}</div>
          <p className="mt-1 text-sm text-muted">Across all your jobs</p>
        </Card>
        <Card className="p-5">
          <span className="label-mono">Approved</span>
          <div className="mt-2 font-display text-3xl font-extrabold">{approved}</div>
          <p className="mt-1 text-sm text-muted">Signed off and issued</p>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent documents</h2>
          <Link href="/documents" className="text-sm font-medium text-ink underline underline-offset-4">
            View all
          </Link>
        </div>

        {docs.length === 0 ? (
          <Card className="flex flex-col items-start gap-3 p-8">
            <p className="font-display text-lg font-bold">No documents yet.</p>
            <p className="text-sm text-muted">
              Build your first RAMS and load plan — it takes a couple of minutes.
            </p>
            <LinkButton href="/documents/new" size="md">Create your first document</LinkButton>
          </Card>
        ) : (
          <Card className="divide-y divide-line">
            {docs.slice(0, 5).map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted">{doc.ref}</span>
                    <Badge tone={doc.status === "APPROVED" ? "ok" : "neutral"}>
                      {doc.status}
                    </Badge>
                  </div>
                  <div className="mt-0.5 truncate font-medium">{doc.title}</div>
                </div>
                <span className="shrink-0 text-sm text-muted">{formatDate(doc.createdAt)}</span>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
