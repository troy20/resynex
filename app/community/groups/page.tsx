import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function GroupsPage() {
  const user = await getCurrentUser();

  const orConditions: any[] = [{ type: "PUBLIC" }];
  if (user) {
    orConditions.push({ members: { some: { userId: user.id } } });
    orConditions.push({ createdById: user.id });
  }

  const groups = await prisma.communityGroup.findMany({
    where: {
      OR: orConditions,
    },
    include: {
      createdBy: { select: { id: true, fullName: true, avatarUrl: true } },
      _count: { select: { members: true, posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Groups</h1>
          <p className="mt-2 text-slate-600">Join groups or create your own to connect with specific users.</p>
        </div>
        {user && (
          <Link
            href="/community/groups/create"
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Create Group
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.length === 0 ? (
          <div className="col-span-2 rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
            <p className="text-slate-600">No groups yet. Be the first to create one!</p>
          </div>
        ) : (
          groups.map((group) => (
            <Link
              key={group.id}
              href={`/community/groups/${group.id}`}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{group.name}</h2>
                  {group.type !== "PUBLIC" && (
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {group.type === "PRIVATE" ? "🔒 Private" : "📧 Invite Only"}
                    </span>
                  )}
                </div>
              </div>
              {group.description && (
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{group.description}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <span>👥 {group._count.members} members</span>
                <span>📝 {group._count.posts} posts</span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Created by {group.createdBy.fullName}
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}