import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireVerified } from "@/lib/auth";

export async function GET() {
  const problems = await prisma.problemPost.findMany({
    where: { status: "PUBLISHED" },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ problems });
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    
    // Check if user is verified or approved
    if (!user.emailVerifiedAt && user.verificationStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Please verify your email or wait for account approval." },
        { status: 403 }
      );
    }

    if (user.role !== "INDUSTRY" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only industry users can post problems. Your role: " + user.role },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, field, expectedOutcome, budgetMin, budgetMax, confidentialityLevel } = body;

    if (!title || !description || !field) {
      return NextResponse.json(
        { error: "Title, description, and field are required" },
        { status: 400 }
      );
    }

    const post = await prisma.problemPost.create({
      data: {
        userId: user.id,
        title,
        description,
        field,
        expectedOutcome,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        confidentialityLevel: confidentialityLevel || "PUBLIC",
      }
    });

    return NextResponse.json({ post, ok: true });
  } catch (error: any) {
    console.error("Problem posting error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create problem" },
      { status: 500 }
    );
  }
}
