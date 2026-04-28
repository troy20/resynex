import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function FriendsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (!user) redirect("/login");

  const requests = await prisma.friendRequest.findMany({
    where: { receiverId: user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold">Friends</h1>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 ring-1 ring-slate-200">
            No friend requests yet.
          </div>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              Friend request: {r.id}
            </div>
          ))
        )}
      </div>
    </main>
  );
}