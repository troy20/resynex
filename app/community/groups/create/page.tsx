"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "PUBLIC" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/community/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/community/groups");
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Create a Community Group</h1>
      <p className="mt-2 text-slate-600">Create a group to connect with specific users.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Group Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-xl border px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="mt-2 w-full rounded-xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Privacy</label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="PUBLIC"
                checked={form.type === "PUBLIC"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="h-4 w-4"
              />
              <div>
                <span className="font-medium">Public</span>
                <p className="text-sm text-slate-500">Anyone can see and join</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="PRIVATE"
                checked={form.type === "PRIVATE"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="h-4 w-4"
              />
              <div>
                <span className="font-medium">Private</span>
                <p className="text-sm text-slate-500">Only invited members can see</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                name="type"
                value="INVITE_ONLY"
                checked={form.type === "INVITE_ONLY"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="h-4 w-4"
              />
              <div>
                <span className="font-medium">Invite Only</span>
                <p className="text-sm text-slate-500">Anyone can request to join</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-2xl border px-5 py-3 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}