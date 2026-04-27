import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id: postId } = await params;

    // Check if user already liked the post
    const existingReaction = await prisma.communityReaction.findFirst({
      where: { postId, userId: user.id }
    });

    if (existingReaction) {
      // Unlike - remove reaction
      await prisma.communityReaction.delete({ where: { id: existingReaction.id } });
      return NextResponse.json({ liked: false });
    } else {
      // Like - add reaction
      await prisma.communityReaction.create({
        data: { postId, userId: user.id }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}