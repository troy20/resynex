import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth";
import { CommunityDetailClient } from "@/components/community/community-detail-client";

export default async function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();

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

  return <CommunityDetailClient post={{ ...post, userReaction }} />;
}
