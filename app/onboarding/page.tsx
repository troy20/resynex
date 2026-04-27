"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RESEARCH_FIELDS = [
  "Artificial Intelligence", "Machine Learning", "Data Science", "Biotechnology",
  "Pharmaceuticals", "Medical Research", "Chemistry", "Physics", "Engineering",
  "Computer Science", "Robotics", "Nanotechnology", "Environmental Science",
  "Renewable Energy", "Materials Science", "Neuroscience", "Psychology",
  "Economics", "Business", "Education", "Agriculture", "Food Science",
  "Space Research", "Oceanography", "Geology", "Climate Science"
];

export default function Onboarding() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (field: string) => {
    setSelectedInterests(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/user/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: selectedInterests })
    });
    
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900">Welcome! 🎉</h1>
          <p className="mt-4 text-xl text-slate-600">Select your research interests to get personalized recommendations.</p>
          <p className="mt-2 text-slate-500">You can always update these later in your profile.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-wrap gap-3">
            {RESEARCH_FIELDS.map(field => (
              <button
                key={field}
                onClick={() => toggleInterest(field)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedInterests.includes(field)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {field}
                {selectedInterests.includes(field) && " ✓"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">
            {selectedInterests.length} interest{selectedInterests.length !== 1 ? "s" : ""} selected
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedInterests.length === 0}
            className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}