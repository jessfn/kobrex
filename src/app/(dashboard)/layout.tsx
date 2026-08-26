import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar userName={session.user.name ?? session.user.email ?? "Usuario"} />
      <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
