import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>

      <div className="mt-8 space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-slate-600 ring-1 ring-slate-200">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="font-semibold text-slate-900">{n.title}</h2>
              <p className="mt-2 text-slate-600">{n.body}</p>
              <p className="mt-3 text-xs text-slate-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}