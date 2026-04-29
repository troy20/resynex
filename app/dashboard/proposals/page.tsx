import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProposalsClient from "./proposals-client";

export default async function ProposalsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/");
  }

  // Only INDUSTRY and ADMIN can view this page
  if (user.role !== "INDUSTRY" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Get all problems posted by this user
  const problems = await prisma.problemPost.findMany({
    where: { userId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  const problemIds = problems.map(p => p.id);

  // Get all proposals for user's problems
  const proposals = await prisma.proposal.findMany({
    where: { problemId: { in: problemIds } },
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

  return <ProposalsClient initialProposals={proposals} />;
}