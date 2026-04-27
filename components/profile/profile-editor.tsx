"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  fullName: string;
  email: string;
  role: string;
  bio?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
  skills?: string[];
  qualifications?: string[];
  experience?: string;
  // Academic
  institutionName?: string;
  institutionalEmail?: string;
  department?: string;
  title?: string;
  researchFields?: string[];
  orcidUrl?: string;
  publicationsUrl?: string;
  // Student
  universityName?: string;
  degreeLevel?: string;
  major?: string;
  graduationYear?: number;
  interests?: string[];
  // Industry
  legalCompanyName?: string;
  tradingName?: string;
  abn?: string;
  companyRegistrationNumber?: string;
  websiteUrl?: string;
  sector?: string;
  headquartersCountry?: string;
  contactPersonName?: string;
  businessEmail?: string;
  // University
  officialUniversityName?: string;
  facultyOrDepartment?: string;
  officialWebsite?: string;
  campusLocation?: string;
  // Startup
  startupName?: string;
  stage?: string;
}

export function ProfileEditor({ initialData }: { initialData: ProfileData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [qualInput, setQualInput] = useState("");
  const [data, setData] = useState<ProfileData>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const addSkill = () => {
    if (skillInput.trim()) {
      setData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }));
  };

  const addQualification = () => {
    if (qualInput.trim()) {
      setData(prev => ({
        ...prev,
        qualifications: [...(prev.qualifications || []), qualInput.trim()]
      }));
      setQualInput("");
    }
  };

  const removeQualification = (index: number) => {
    setData(prev => ({
      ...prev,
      qualifications: (prev.qualifications || []).filter((_, i) => i !== index)
    }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    const json = await res.json();
    setLoading(false);
    
    if (res.ok) {
      setMessage("Profile updated successfully!");
      router.refresh();
    } else {
      setMessage(json.error || "Failed to update profile");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              value={data.fullName}
              onChange={e => setData({ ...data, fullName: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              value={data.email}
              disabled
              className="w-full rounded-2xl border px-4 py-3 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              value={data.bio || ""}
              onChange={e => setData({ ...data, bio: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
            <input
              value={data.country || ""}
              onChange={e => setData({ ...data, country: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
            <input
              value={data.city || ""}
              onChange={e => setData({ ...data, city: e.target.value })}
              className="w-full rounded-2xl border px-4 py-3"
              placeholder="City"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
            className="flex-1 rounded-2xl border px-4 py-3"
            placeholder="Add a skill (press Enter)"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.skills || []).map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm">
              {skill}
              <button type="button" onClick={() => removeSkill(i)} className="text-slate-500 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Qualifications */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-xl font-bold mb-4">Qualifications</h2>
        <div className="flex gap-2 mb-3">
          <input
            value={qualInput}
            onChange={e => setQualInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addQualification())}
            className="flex-1 rounded-2xl border px-4 py-3"
            placeholder="Add a qualification (press Enter)"
          />
          <button
            type="button"
            onClick={addQualification}
            className="px-4 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.qualifications || []).map((qual, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm">
              {qual}
              <button type="button" onClick={() => removeQualification(i)} className="text-slate-500 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
        <h2 className="text-xl font-bold mb-4">Experience</h2>
        <textarea
          value={data.experience || ""}
          onChange={e => setData({ ...data, experience: e.target.value })}
          className="w-full rounded-2xl border px-4 py-3"
          rows={4}
          placeholder="Describe your work experience..."
        />
      </div>

      {/* Role-specific fields */}
      {data.role === "ACADEMIC" && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold mb-4">Academic Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
              <input
                value={data.institutionName || ""}
                onChange={e => setData({ ...data, institutionName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institutional Email</label>
              <input
                value={data.institutionalEmail || ""}
                onChange={e => setData({ ...data, institutionalEmail: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input
                value={data.department || ""}
                onChange={e => setData({ ...data, department: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                value={data.title || ""}
                onChange={e => setData({ ...data, title: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ORCID URL</label>
              <input
                value={data.orcidUrl || ""}
                onChange={e => setData({ ...data, orcidUrl: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publications URL</label>
              <input
                value={data.publicationsUrl || ""}
                onChange={e => setData({ ...data, publicationsUrl: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        </div>
      )}

      {data.role === "STUDENT" && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold mb-4">Student Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
              <input
                value={data.universityName || ""}
                onChange={e => setData({ ...data, universityName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree Level</label>
              <input
                value={data.degreeLevel || ""}
                onChange={e => setData({ ...data, degreeLevel: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
                placeholder="e.g., Bachelor's, Master's, PhD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Major</label>
              <input
                value={data.major || ""}
                onChange={e => setData({ ...data, major: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
              <input
                type="number"
                value={data.graduationYear || ""}
                onChange={e => setData({ ...data, graduationYear: parseInt(e.target.value) })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        </div>
      )}

      {data.role === "INDUSTRY" && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold mb-4">Company Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Legal Company Name</label>
              <input
                value={data.legalCompanyName || ""}
                onChange={e => setData({ ...data, legalCompanyName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trading Name</label>
              <input
                value={data.tradingName || ""}
                onChange={e => setData({ ...data, tradingName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ABN</label>
              <input
                value={data.abn || ""}
                onChange={e => setData({ ...data, abn: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                value={data.websiteUrl || ""}
                onChange={e => setData({ ...data, websiteUrl: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
              <input
                value={data.sector || ""}
                onChange={e => setData({ ...data, sector: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Headquarters Country</label>
              <input
                value={data.headquartersCountry || ""}
                onChange={e => setData({ ...data, headquartersCountry: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        </div>
      )}

      {data.role === "UNIVERSITY" && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold mb-4">University Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Official University Name</label>
              <input
                value={data.officialUniversityName || ""}
                onChange={e => setData({ ...data, officialUniversityName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Faculty/Department</label>
              <input
                value={data.facultyOrDepartment || ""}
                onChange={e => setData({ ...data, facultyOrDepartment: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institutional Email</label>
              <input
                value={data.institutionalEmail || ""}
                onChange={e => setData({ ...data, institutionalEmail: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                value={data.officialWebsite || ""}
                onChange={e => setData({ ...data, officialWebsite: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                value={data.country || ""}
                onChange={e => setData({ ...data, country: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campus Location</label>
              <input
                value={data.campusLocation || ""}
                onChange={e => setData({ ...data, campusLocation: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        </div>
      )}

      {data.role === "STARTUP" && (
        <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold mb-4">Startup Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Startup Name</label>
              <input
                value={data.startupName || ""}
                onChange={e => setData({ ...data, startupName: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
              <input
                value={data.stage || ""}
                onChange={e => setData({ ...data, stage: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
                placeholder="e.g., Idea, Seed, Series A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
              <input
                value={data.sector || ""}
                onChange={e => setData({ ...data, sector: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                value={data.websiteUrl || ""}
                onChange={e => setData({ ...data, websiteUrl: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                value={data.country || ""}
                onChange={e => setData({ ...data, country: e.target.value })}
                className="w-full rounded-2xl border px-4 py-3"
              />
            </div>
          </div>
        </div>
      )}

      {message && (
        <p className={`rounded-xl p-3 text-sm ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}