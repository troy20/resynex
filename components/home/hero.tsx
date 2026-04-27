"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/home/auth-card";

const RESEARCH_FIELDS = [
  "Artificial Intelligence", "Machine Learning", "Data Science", "Biotechnology",
  "Pharmaceuticals", "Medical Research", "Chemistry", "Physics", "Engineering",
  "Computer Science", "Robotics", "Nanotechnology", "Environmental Science",
  "Renewable Energy", "Materials Science", "Neuroscience", "Psychology",
  "Economics", "Business", "Education", "Agriculture", "Food Science",
  "Space Research", "Oceanography", "Geology", "Climate Science"
];

export function Hero() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"facilities" | "problems">("facilities");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === "facilities") {
      router.push(`/facilities?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/problems?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100"/>
      <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"/>
      <div className="absolute top-40 right-10 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl"/>
      
      <div className="relative mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm mb-6">
              Connect • Collaborate • Innovate
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Where <span className="text-blue-600">Research</span> Meets <span className="text-blue-600">Opportunity</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-600 max-w-xl">
              Discover university facilities, find industry problems to solve, and connect with researchers and innovators worldwide.
            </p>

            {/* Search Box - Booking.com Style */}
            <div className="mt-10 bg-white rounded-3xl shadow-xl p-2 ring-1 ring-slate-200">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row">
                <div className="flex rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-blue-500">
                  <button
                    type="button"
                    onClick={() => setSearchType("facilities")}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      searchType === "facilities" 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🔬 Facilities
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchType("problems")}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      searchType === "problems" 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    💡 Problems
                  </button>
                </div>
                <div className="flex-1 mt-2 sm:mt-0 sm:ml-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === "facilities" ? "Search facilities by name, equipment, or location..." : "Search problems by title, field, or description..."}
                    className="w-full h-full min-h-[52px] px-5 text-lg bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 sm:mt-0 sm:ml-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/facilities" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Browse Facilities
              </a>
              <a href="/problems" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Browse Problems
              </a>
              <a href="/community" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Community
              </a>
            </div>
          </div>

          {/* Right - Auth Card */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl ring-1 ring-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Join the Network</h2>
                <p className="text-slate-600 mb-6">Connect with universities, industry, and researchers.</p>
                <AuthCard />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Auth Toggle */}
        <div className="lg:hidden mt-8">
          <button 
            onClick={() => setShowAuth(!showAuth)}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl"
          >
            {showAuth ? "Hide Login" : "Login / Register"}
          </button>
          {showAuth && (
            <div className="mt-4">
              <AuthCard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { RESEARCH_FIELDS };
