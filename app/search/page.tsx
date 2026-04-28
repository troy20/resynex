import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  const user = await getCurrentUser();

  const searchTerm = query.toLowerCase();

  const [users, groups, posts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { id: true, fullName: true, role: true, avatarUrl: true, bio: true },
      take: 20,
    }),
    prisma.communityGroup.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
        ...(user ? {} : { type: "PUBLIC" }),
      },
      include: {
        createdBy: { select: { id: true, fullName: true } },
        _count: { select: { members: true, posts: true } },
      },
      take: 20,
    }),
    prisma.communityPost.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
        ],
        groupId: null,
      },
      include: {
        author: { select: { id: true, fullName: true, role: true } },
        _count: { select: { comments: true, reactions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Search Results</h1>
      <p className="mt-2 text-slate-600">
        {query ? `Results for "${query}"` : "Enter a search term"}
      </p>

      {query && (
        <>
          {/* Users */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {users.length === 0 ? (
                <p className="text-slate-500">No users found</p>
              ) : (
                users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/profiles/${u.id}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {u.fullName[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{u.fullName}</div>
                        <div className="text-sm text-slate-500 capitalize">{u.role.toLowerCase()}</div>
                      </div>
                    </div>
                    {u.bio && (
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{u.bio}</p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Groups */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Groups ({groups.length})</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {groups.length === 0 ? (
                <p className="text-slate-500">No groups found</p>
              ) : (
                groups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/community/groups/${g.id}`}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{g.name}</h3>
                      {g.type !== "PUBLIC" && <span className="text-sm">🔒</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {g._count.members} members · {g._count.posts} posts
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Created by {g.createdBy.fullName}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Posts */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
            <div className="mt-4 space-y-4">
              {posts.length === 0 ? (
                <p className="text-slate-500">No posts found</p>
              ) : (
                posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/community/${p.id}`}
                    className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:ring-blue-300"
                  >
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>by {p.author.fullName}</span>
                      <span>💬 {p._count.comments}</span>
                      <span>❤️ {p._count.reactions}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}