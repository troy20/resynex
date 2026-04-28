import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  
  const groups = await prisma.communityGroup.findMany({
    where: {
      OR: [
        { type: "PUBLIC" },
        { members: user ? { some: { userId: user.id } } : undefined },
        { createdById: user?.id },
      ],
    },
    include: {
      createdBy: { select: { id: true, fullName: true, avatarUrl: true } },
      _count: { select: { members: true, posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ groups });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, type = "PUBLIC" } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Group name is required" }, { status: 400 });
  }

  const group = await prisma.communityGroup.create({
    data: {
      name,
      description,
      type,
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
    include: {
      createdBy: { select: { id: true, fullName: true } },
    },
  });

  return NextResponse.json({ group });
}