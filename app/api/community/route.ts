import { prisma } from "@/lib/prisma";
import { requireUser, requireVerified, getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const posts = await prisma.communityPost.findMany({
    include: {
      author: { select: { id: true, fullName: true, role: true, avatarUrl: true } },
      comments: true,
      reactions: true,
      _count: { select: { comments: true, reactions: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const postsWithReactions = posts.map(post => ({
    ...post,
    userReaction: user ? post.reactions.some(r => r.userId === user.id) : false,
    reactions: undefined
  }));

  return Response.json({ posts: postsWithReactions });
}

export async function POST(req: Request) {
  const user = await requireUser();
  requireVerified(user);
  const b = await req.json();
  const post = await prisma.communityPost.create({
    data: {
      authorUserId: user.id,
      type: b.type || "POST",
      title: b.title,
      content: b.content,
      topic: b.topic,
      tags: b.tags ? String(b.tags).split(",").map((s: string) => s.trim()) : []
    }
  });
  return Response.json({ post });
}
