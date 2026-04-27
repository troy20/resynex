import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CommunityDetailClient } from "@/components/community/community-detail-client";

export default async function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, fullName: true, role: true } },
      comments: {
        include: { author: { select: { id: true, fullName: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { reactions: true } },
    },
  });

  if (!post) notFound();

  let userReaction = false;
  if (user) {
    const reaction = await prisma.communityReaction.findFirst({
      where: { postId: id, userId: user.id },
    });
    userReaction = !!reaction;
  }

  // Serialize dates to strings for client component
  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString(),
    comments: post.comments.map(c => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
  };

  return <CommunityDetailClient post={{ ...serializedPost, userReaction }} />;
}
