import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all"; // all, users, groups, posts

  if (!query || query.length < 2) {
    return Response.json({ users: [], groups: [], posts: [] });
  }

  const user = await getCurrentUser();
  const searchTerm = query.toLowerCase();

  const results: any = { users: [], groups: [], posts: [] };

  // Search users
  if (type === "all" || type === "users") {
    results.users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { id: true, fullName: true, role: true, avatarUrl: true },
      take: 10,
    });
  }

  // Search groups
  if (type === "all" || type === "groups") {
    const groupWhere: any = {
      name: { contains: searchTerm, mode: "insensitive" },
    };
    
    // For private groups, only show if user is a member
    if (!user) {
      groupWhere.type = "PUBLIC";
    }

    results.groups = await prisma.communityGroup.findMany({
      where: groupWhere,
      select: { id: true, name: true, type: true, _count: { select: { members: true } } },
      take: 10,
    });
  }

  // Search posts
  if (type === "all" || type === "posts") {
    results.posts = await prisma.communityPost.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
        ],
        groupId: null, // Only global posts in search
      },
      include: {
        author: { select: { id: true, fullName: true } },
      },
      take: 10,
    });
  }

  return Response.json(results);
}