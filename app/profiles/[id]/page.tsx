import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      academicProfile: true,
      studentProfile: true,
      industryProfile: true,
      universityProfile: true,
      startupProfile: true,
    },
  });

  if (!user) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user.fullName}
            </h1>
            <p className="mt-2 text-slate-600">{user.role}</p>
            <p className="mt-4 text-slate-700">{user.bio || "No bio yet."}</p>
          </div>

          <form action={`/api/friends/request?targetUserId=${user.id}`} method="POST">
            <button className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">
              Add Friend
            </button>
          </form>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Profile details</h2>

          {user.academicProfile && (
            <div className="mt-4 space-y-2 text-slate-700">
              <p>Institution: {user.academicProfile.institutionName}</p>
              <p>Department: {user.academicProfile.department}</p>
              <p>Title: {user.academicProfile.title}</p>
            </div>
          )}

          {user.industryProfile && (
            <div className="mt-4 space-y-2 text-slate-700">
              <p>Company: {user.industryProfile.legalCompanyName}</p>
              <p>Sector: {user.industryProfile.sector}</p>
              <p>Website: {user.industryProfile.websiteUrl}</p>
            </div>
          )}

          {user.universityProfile && (
            <div className="mt-4 space-y-2 text-slate-700">
              <p>University: {user.universityProfile.officialUniversityName}</p>
              <p>Country: {user.universityProfile.country}</p>
              <p>Website: {user.universityProfile.officialWebsite}</p>
            </div>
          )}
        </div>

        <Link
          href="/community"
          className="mt-8 inline-block text-sm font-medium text-blue-700"
        >
          Back to community
        </Link>
      </div>
    </main>
  );
}