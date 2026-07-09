import { redirect } from "next/navigation";
import { getUserWithUsage } from "@/server/user";
import { Sidebar } from "@/components/app/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getUserWithUsage();
  if (!data) redirect("/login");
  const { user, usage } = data;

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <Sidebar
        name={user.name ?? "Account"}
        email={user.email}
        used={usage.used}
        limit={usage.limit}
        planName={usage.plan.name}
      />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
