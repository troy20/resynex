import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    // Only INDUSTRY users can update proposal status
    if (user.role !== "INDUSTRY" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only industry users can update proposal status" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get the proposal and verify ownership
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { problem: true },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Verify the user owns the problem
    if (user.role !== "ADMIN" && proposal.problem?.userId !== user.id) {
      return NextResponse.json(
        { error: "You can only update proposals for your own problems" },
        { status: 403 }
      );
    }

    const updated = await prisma.proposal.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ proposal: updated, ok: true });
  } catch (error: any) {
    console.error("Update proposal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update proposal" },
      { status: 500 }
    );
  }
}