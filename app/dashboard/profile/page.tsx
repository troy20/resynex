import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/profile/profile-editor";

export default async function Profile() {
  const u = await getCurrentUser();
  if (!u) redirect("/#auth");

  const user = await prisma.user.findUnique({
    where: { id: u.id },
    include: {
      academicProfile: true,
      studentProfile: true,
      industryProfile: true,
      universityProfile: true,
      startupProfile: true,
    },
  });

  // Helper to filter out null values
  const filterNulls = (obj: Record<string, unknown>) => 
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));

  const profileData = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    role: user?.role || "",
    bio: user?.bio || undefined,
    country: user?.country || undefined,
    city: user?.city || undefined,
    avatarUrl: user?.avatarUrl || undefined,
    skills: [],
    qualifications: [],
    experience: undefined,
    ...filterNulls(user?.academicProfile || {}),
    ...filterNulls(user?.studentProfile || {}),
    ...filterNulls(user?.industryProfile || {}),
    ...filterNulls(user?.universityProfile || {}),
    ...filterNulls(user?.startupProfile || {}),
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-2 text-slate-600">Update your profile information, skills, and qualifications.</p>
      <div className="mt-6">
        <ProfileEditor initialData={profileData} />
      </div>
    </div>
  );
}
