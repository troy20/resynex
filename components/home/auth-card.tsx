"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthCard() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"personal" | "university" | "industry">("personal");
  const [role, setRole] = useState("ACADEMIC");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      if (value.toString().trim()) {
        data[key] = value.toString();
      }
    });
    
    // Map user type to role
    if (userType === "personal") {
      data.role = role;
    } else if (userType === "university") {
      data.role = "UNIVERSITY";
    } else if (userType === "industry") {
      data.role = "INDUSTRY";
    }

    const url = tab === "login" ? "/api/auth/login" : "/api/auth/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(json.error || "Something went wrong");
      return;
    }

    if (tab === "login") {
      router.push("/dashboard");
      router.refresh();
    } else {
      if (userType === "university" || userType === "industry") {
        setMessage("Account created! Your account is pending approval. We'll notify you once verified.");
      } else {
        setMessage("Account created! Please check your email to verify, then set your preferences.");
      }
    }
  }

  return (
    <div id="auth" className="rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
      <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-medium">
        <button onClick={() => { setTab("login"); setMessage(""); }} className={`rounded-xl px-4 py-3 ${tab === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
          Log in
        </button>
        <button onClick={() => { setTab("register"); setMessage(""); }} className={`rounded-xl px-4 py-3 ${tab === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
          Register
        </button>
      </div>

      {tab === "register" && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">I am a:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setUserType("personal"); setRole("ACADEMIC"); }}
              className={`rounded-xl p-3 text-center transition-all ${
                userType === "personal"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <div className="text-2xl mb-1">👤</div>
              <div className="text-xs font-medium">Personal</div>
              <div className="text-[10px] opacity-75">Researcher, Student</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("university")}
              className={`rounded-xl p-3 text-center transition-all ${
                userType === "university"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <div className="text-2xl mb-1">🏛️</div>
              <div className="text-xs font-medium">University</div>
              <div className="text-[10px] opacity-75">Requires approval</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("industry")}
              className={`rounded-xl p-3 text-center transition-all ${
                userType === "industry"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-xs font-medium">Industry</div>
              <div className="text-[10px] opacity-75">Requires approval</div>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        {tab === "register" && (
          <>
            <input name="fullName" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Full name" />
            
            {/* Personal type - show role selection */}
            {userType === "personal" && (
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="ACADEMIC">Academic Researcher</option>
                <option value="STUDENT">Student</option>
                <option value="STARTUP">Startup</option>
              </select>
            )}

            {/* Academic fields */}
            {userType === "personal" && role === "ACADEMIC" && (
              <>
                <input name="institutionName" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Institution name *" />
                <input name="department" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Department" />
                <input name="title" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Title (e.g., Professor, Dr.)" />
                <input name="researchFields" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Research fields (comma separated)" />
              </>
            )}

            {/* Student fields */}
            {userType === "personal" && role === "STUDENT" && (
              <>
                <input name="universityName" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="University name" />
                <input name="degreeLevel" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Degree level (e.g., Bachelor, Master, PhD)" />
                <input name="major" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Major / Field of study" />
              </>
            )}

            {/* Startup fields */}
            {userType === "personal" && role === "STARTUP" && (
              <>
                <input name="startupName" required className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Startup name *" />
                <select name="stage" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  <option value="">Select stage</option>
                  <option value="Idea">Idea</option>
                  <option value="MVP">MVP</option>
                  <option value="Early">Early Stage</option>
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                </select>
                <input name="sector" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Sector (e.g., Fintech, HealthTech)" />
                <input name="websiteUrl" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Website URL" />
              </>
            )}

            {/* University fields - requires approval */}
            {userType === "university" && (
              <div className="space-y-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
                <div className="text-sm font-medium text-amber-800">University Registration (Requires Approval)</div>
                <input name="officialUniversityName" required className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Official university name *" />
                <input name="department" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Faculty / Department" />
                <input name="websiteUrl" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="University website" />
                <input name="contactPersonName" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Contact person name" />
                <input name="institutionalEmail" required className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Institutional email *" />
              </div>
            )}

            {/* Industry fields - requires approval */}
            {userType === "industry" && (
              <div className="space-y-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
                <div className="text-sm font-medium text-amber-800">Industry Registration (Requires Approval)</div>
                <input name="legalCompanyName" required className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Company legal name *" />
                <input name="abn" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="ABN / Registration number" />
                <input name="companyRegistrationNumber" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Company registration number" />
                <input name="websiteUrl" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Website URL" />
                <input name="sector" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Sector (e.g., Technology, Healthcare)" />
                <input name="contactPersonName" className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Contact person name" />
                <input name="businessEmail" required className="w-full rounded-2xl border border-amber-200 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" placeholder="Business email *" />
              </div>
            )}
          </>
        )}

        <input name="email" required type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Email address" />
        <input name="password" required type="password" minLength={8} className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Password (min 8 characters)" />
        
        <button disabled={loading} className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Please wait..." : tab === "login" ? "Log in" : "Register account"}
        </button>

        {message && (
          <p className={`rounded-xl p-3 text-sm ${message.includes("created") || message.includes("pending") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </p>
        )}
      </form>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <strong>Personal:</strong> Researchers, Students - register freely, then set preferences.<br/>
        <strong>University/Industry:</strong> Requires admin approval before full access.
      </div>
    </div>
  );
}
