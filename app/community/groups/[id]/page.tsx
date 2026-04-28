import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const group = await prisma.communityGroup.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, fullName: true, avatarUrl: true } },
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
        },
      },
      posts: {
        where: { groupId: id },
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true, role: true } },
          _count: { select: { comments: true, reactions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!group) notFound();

  const isMember = user ? group.members.some((m) => m.userId === user.id) : false;
  const isAdmin = user?.id === group.createdById || group.members.some((m) => m.userId === user?.id && m.role === "ADMIN");

  // Check access for private groups
  if (group.type === "PRIVATE" && !isMember && user?.id !== group.createdById) {
    redirect("/community/groups");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Group Header */}
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{group.name}</h1>
            {group.type !== "PUBLIC" && (
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {group.type === "PRIVATE" ? "🔒 Private" : "📧 Invite Only"}
              </span>
            )}
          </div>
          {user && !isMember && group.type === "PUBLIC" && (
            <form action={`/api/community/groups/${group.id}/join`} method="POST">
              <button className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">
                Join Group
              </button>
            </form>
          )}
        </div>

        {group.description && (
          <p className="mt-4 text-slate-600">{group.description}</p>
        )}

        <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
          <span>👥 {group.members.length} members</span>
          <span>📝 {group.posts.length} posts</span>
          <span>Created by {group.createdBy.fullName}</span>
        </div>
      </div>

      {/* Members */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold">Members</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {group.members.map((m) => (
            <Link
              key={m.id}
              href={`/profiles/${m.user.id}`}
              className="flex items-center gap-2 rounded-xl p-2 hover:bg-slate-50"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {m.user.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-medium">{m.user.fullName}</div>
                <div className="text-xs text-slate-500 capitalize">{m.role.toLowerCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Posts</h2>
          {isMember && (
            <Link
              href={`/community/groups/${group.id}/create-post`}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              New Post
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {group.posts.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
              <p className="text-slate-600">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            group.posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="block rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {post.author.fullName[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{post.author.fullName}</div>
                    <div className="text-xs text-slate-500">
                      {post.author.role} · {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
                <p className="mt-2 text-slate-600 line-clamp-2">{post.content}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>💬 {post._count.comments}</span>
                  <span>❤️ {post._count.reactions}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <Link
        href="/community/groups"
        className="mt-8 inline-block text-sm font-medium text-blue-700"
      >
        ← Back to Groups
      </Link>
    </main>
  );
}