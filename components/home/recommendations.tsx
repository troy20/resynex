"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  field?: string;
  location?: string;
  user: { fullName: string; role: string };
  createdAt: Date;
}

export function Recommendations() {
  const [data, setData] = useState<{ problems: Recommendation[]; facilities: Recommendation[]; basedOn: string | string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommendations")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      <div className="h-24 bg-slate-200 rounded"></div>
      <div className="h-24 bg-slate-200 rounded"></div>
    </div>;
  }

  if (!data || (data.problems.length === 0 && data.facilities.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Recommended for You</h2>
        <p className="text-sm text-slate-500">
          Based on your interests: {Array.isArray(data.basedOn) ? data.basedOn.join(", ") : "recent activity"}
        </p>
      </div>

      {data.problems.length > 0 && (
        <div>
          <h3 className="font-semibold text-orange-700 mb-3">💡 Problems</h3>
          <div className="space-y-3">
            {data.problems.map(problem => (
              <Link 
                key={problem.id} 
                href={`/problems/${problem.id}`}
                className="block p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <div className="font-medium text-slate-900">{problem.title}</div>
                <div className="text-sm text-slate-600 mt-1 line-clamp-2">{problem.description}</div>
                <div className="text-xs text-slate-500 mt-2">
                  {problem.user.fullName} · {problem.field || "General"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {data.facilities.length > 0 && (
        <div>
          <h3 className="font-semibold text-green-700 mb-3">🔬 Facilities</h3>
          <div className="space-y-3">
            {data.facilities.map(facility => (
              <Link 
                key={facility.id} 
                href={`/facilities/${facility.id}`}
                className="block p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="font-medium text-slate-900">{facility.title}</div>
                <div className="text-sm text-slate-600 mt-1 line-clamp-2">{facility.description}</div>
                <div className="text-xs text-slate-500 mt-2">
                  {facility.user.fullName} · {facility.location || "Location not specified"}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}