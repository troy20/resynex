"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface Applicant {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
}

interface Problem {
  id: string;
  title: string;
}

interface Proposal {
  id: string;
  proposalMessage: string;
  budgetOffer: number | null;
  status: string;
  createdAt: Date;
  applicant: Applicant;
  problem: Problem | null;
}

export default function ProposalsClient({ initialProposals }: { initialProposals: Proposal[] }) {
  const router = useRouter();
  const [proposals, setProposals] = useState(initialProposals);

  const updateStatus = async (proposalId: string, status: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setProposals(proposals.map(p => 
          p.id === proposalId ? { ...p, status } : p
        ));
      }
    } catch (error) {
      console.error("Failed to update proposal:", error);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <p className="mt-2 text-slate-600">View proposals submitted for your problems</p>
      </div>

      {proposals.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
          <p className="text-slate-500">No proposals yet. Share your problems to receive proposals from researchers.</p>
          <Link href="/dashboard/create/problem" className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
            Post a Problem
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Link href={`/profiles/${proposal.applicant.id}`} className="font-semibold text-blue-600 hover:underline">
                      {proposal.applicant.fullName}
                    </Link>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[proposal.status]}`}>
                      {proposal.status}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{proposal.proposalMessage}</p>
                  {proposal.budgetOffer && (
                    <p className="mt-2 text-sm font-medium text-green-600">
                      Budget Offer: ${proposal.budgetOffer.toLocaleString()}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    For problem: {proposal.problem?.title} · {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {proposal.status === "PENDING" && (
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => updateStatus(proposal.id, "ACCEPTED")}
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => updateStatus(proposal.id, "REJECTED")}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}