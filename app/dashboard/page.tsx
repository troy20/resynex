import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Recommendations } from "@/components/home/recommendations";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/#auth");

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>
      <p className="mt-2 text-slate-600">Role: {user.role} · Email: {user.emailVerifiedAt ? "verified" : "not verified"}</p>
      
      <div className="mt-8">
        <Recommendations />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Profile", "Messages", "Saved", "Verification", "Community", "Actions"].map(x => (
          <div key={x} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <div className="font-semibold">{x}</div>
            <p className="mt-2 text-sm text-slate-500">Manage your {x.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
