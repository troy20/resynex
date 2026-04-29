import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

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

    const body = await req.json();
    const { problemId, proposalMessage, budgetOffer } = body;

    if (!problemId || !proposalMessage) {
      return NextResponse.json(
        { error: "Problem ID and proposal message are required" },
        { status: 400 }
      );
    }

    // Check if problem exists
    const problem = await prisma.problemPost.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // Check if user already submitted a proposal for this problem
    const existingProposal = await prisma.proposal.findFirst({
      where: {
        problemId,
        applicantUserId: user.id,
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this problem" },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.create({
      data: {
        applicantUserId: user.id,
        problemId,
        proposalMessage,
        budgetOffer: budgetOffer ? Number(budgetOffer) : null,
      },
    });

    return NextResponse.json({ proposal, ok: true });
  } catch (error: any) {
    console.error("Proposal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit proposal" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const problemId = searchParams.get("problemId");

    // If user is INDUSTRY, show proposals for their problems
    if (user.role === "INDUSTRY") {
      const problems = await prisma.problemPost.findMany({
        where: { userId: user.id },
        select: { id: true },
      });
      const problemIds = problems.map(p => p.id);

      const proposals = await prisma.proposal.findMany({
        where: problemId 
          ? { problemId, problem: { userId: user.id } }
          : { problemId: { in: problemIds } },
        include: {
          applicant: {
            select: { id: true, fullName: true, avatarUrl: true, role: true },
          },
          problem: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ proposals });
    }

    // For other roles, show their own proposals
    const proposals = await prisma.proposal.findMany({
      where: { applicantUserId: user.id },
      include: {
        problem: {
          select: { id: true, title: true, userId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ proposals });
  } catch (error: any) {
    console.error("Get proposals error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get proposals" },
      { status: 500 }
    );
  }
}