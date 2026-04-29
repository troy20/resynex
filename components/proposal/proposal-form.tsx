"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProposalFormProps {
  problemId: string;
  isLoggedIn: boolean;
}

export function ProposalForm({ problemId, isLoggedIn }: ProposalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      problemId,
      proposalMessage: formData.get("proposalMessage"),
      budgetOffer: formData.get("budgetOffer"),
    };

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to submit proposal");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center">
        <p className="text-slate-600">Please log in to submit a proposal</p>
        <a href="/#auth" className="mt-3 inline-block rounded-xl bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
          Log in
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl bg-green-50 p-6 text-center ring-1 ring-green-200">
        <p className="text-green-700 font-medium">Proposal submitted successfully!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
      <h2 className="text-xl font-bold">Submit Your Proposal</h2>
      <p className="mt-1 text-sm text-slate-500">Describe how you would approach solving this problem</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Your Proposal *</label>
          <textarea
            name="proposalMessage"
            required
            rows={5}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Describe your approach, relevant experience, and how you would solve this problem..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Your Budget Offer ($)</label>
          <input
            name="budgetOffer"
            type="number"
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., 15000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}