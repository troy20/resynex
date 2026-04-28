import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const group = await prisma.communityGroup.findUnique({ where: { id } });
  if (!group) {
    return Response.json({ error: "Group not found" }, { status: 404 });
  }

  // Check if already a member
  const existingMember = await prisma.communityGroupMember.findUnique({
    where: { groupId_userId: { groupId: id, userId: user.id } },
  });

  if (existingMember) {
    return Response.json({ error: "Already a member" }, { status: 400 });
  }

  await prisma.communityGroupMember.create({
    data: {
      groupId: id,
      userId: user.id,
      role: "MEMBER",
    },
  });

  redirect(`/community/groups/${id}`);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.communityGroupMember.delete({
    where: { groupId_userId: { groupId: id, userId: user.id } },
  });

  return Response.json({ ok: true });
}