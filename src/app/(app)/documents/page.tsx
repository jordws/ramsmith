import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/user";
import { listDocuments } from "@/server/documents";
import { PageHeader } from "@/components/app/PageHeader";
import { LinkButton, Card, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Documents — RAMSmith" };

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const docs = await listDocuments(user.id);

  return (
    <div className="container-page py-8">
      <PageHeader
        eyebrow="Library"
        title="Documents"
        action={<LinkButton href="/documents/new">New document</LinkButton>}
      />

      {docs.length === 0 ? (
        <Card className="mt-6 flex flex-col items-start gap-3 p-8">
          <p className="font-display text-lg font-bold">Your library is empty.</p>
          <p className="text-sm text-muted">Every document you create is saved here for re-issue.</p>
          <LinkButton href="/documents/new">Create your first document</LinkButton>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              <Card className="h-full p-5 transition-shadow hover:shadow-lift">
                <div className="hazard-rule mb-4 -mx-5 -mt-5 rounded-t-card" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{doc.ref}</span>
                  <Badge tone={doc.status === "APPROVED" ? "ok" : "neutral"}>{doc.status}</Badge>
                </div>
                <h2 className="mt-2 font-display text-lg font-bold leading-snug">{doc.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {doc.eventName} · {doc.venue}
                </p>
                <p className="mt-4 font-mono text-xs text-muted">{formatDate(doc.createdAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
