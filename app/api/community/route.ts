import { prisma } from "@/lib/prisma";
import { requireUser, requireVerified, getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const where: any = {};
  
  // If groupId is provided, only get posts from that group
  if (groupId) {
    where.groupId = groupId;
    // Check if user is a member of the group
    if (user) {
      const membership = await prisma.communityGroupMember.findUnique({
        where: { groupId_userId: { groupId, userId: user.id } },
      });
      const group = await prisma.communityGroup.findUnique({ where: { id: groupId } });
      if (!membership && group?.createdById !== user.id && group?.type === "PRIVATE") {
        return Response.json({ posts: [] });
      }
    }
  } else {
    // Get all posts not in any group (global feed)
    where.groupId = null;
  }

  const posts = await prisma.communityPost.findMany({
    where,
    include: {
      author: { select: { id: true, fullName: true, role: true, avatarUrl: true } },
      group: { select: { id: true, name: true } },
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
  
  // Check if posting to a group
  let groupId = b.groupId;
  if (groupId) {
    const membership = await prisma.communityGroupMember.findUnique({
      where: { groupId_userId: { groupId, userId: user.id } },
    });
    const group = await prisma.communityGroup.findUnique({ where: { id: groupId } });
    if (!membership && group?.createdById !== user.id) {
      return Response.json({ error: "You must be a member to post in this group" }, { status: 403 });
    }
  }

  const post = await prisma.communityPost.create({
    data: {
      authorUserId: user.id,
      groupId,
      type: b.type || "POST",
      title: b.title,
      content: b.content,
      topic: b.topic,
      tags: b.tags ? String(b.tags).split(",").map((s: string) => s.trim()) : []
    }
  });
  return Response.json({ post });
}
