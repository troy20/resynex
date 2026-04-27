"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProblem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      field: formData.get("field"),
      expectedOutcome: formData.get("expectedOutcome"),
      budgetMin: formData.get("budgetMin"),
      budgetMax: formData.get("budgetMax"),
      confidentialityLevel: formData.get("confidentialityLevel"),
    };

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create problem");
        return;
      }

      router.push("/problems");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Post a Problem</h1>
      <p className="mt-2 text-slate-600">Describe a research challenge you're looking to solve.</p>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700">Problem Title *</label>
          <input name="title" required className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="e.g., Need solution for sustainable energy storage" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description *</label>
          <textarea name="description" required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Describe the problem in detail..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Research Field *</label>
          <select name="field" required className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">Select a field</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Biotechnology">Biotechnology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Climate Science">Climate Science</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Environmental Science">Environmental Science</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Materials Science">Materials Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Medicine">Medicine</option>
            <option value="Neuroscience">Neuroscience</option>
            <option value="Physics">Physics</option>
            <option value="Robotics">Robotics</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Expected Outcome</label>
          <textarea name="expectedOutcome" rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="What outcome are you hoping for?" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Min Budget ($)</label>
            <input name="budgetMin" type="number" className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="5000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Max Budget ($)</label>
            <input name="budgetMax" type="number" className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="50000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Confidentiality Level</label>
          <select name="confidentialityLevel" className="mt-1 w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="CONFIDENTIAL">Confidential</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Creating..." : "Create Problem"}
        </button>
      </form>
    </main>
  );
}
