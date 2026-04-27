import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interests } = await req.json();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        interests: interests || [],
        onboardingCompleted: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Interests update error:", error);
    return NextResponse.json({ error: "Failed to update interests" }, { status: 500 });
  }
}