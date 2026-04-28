import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const url = new URL(req.url);
  const targetUserId = url.searchParams.get("targetUserId");

  if (!targetUserId) {
    return Response.json({ error: "Missing user ID" }, { status: 400 });
  }

  if (currentUser.id === targetUserId) {
    return Response.json({ error: "You cannot add yourself" }, { status: 400 });
  }

  await prisma.friendRequest.create({
    data: {
      senderId: currentUser.id,
      receiverId: targetUserId,
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetUserId,
      title: "New friend request",
      body: `${currentUser.fullName} sent you a friend request.`,
      actionUrl: "/dashboard/friends",
    },
  });

  redirect(`/profiles/${targetUserId}`);
}