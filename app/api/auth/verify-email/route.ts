import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  const record = await prisma.emailVerificationToken.findUnique({ where:{ token }, include:{ user:true }});
  if (!record || record.usedAt || record.expiresAt < new Date()) redirect("/?verified=invalid");
  await prisma.user.update({ where:{ id:record.userId }, data:{ emailVerifiedAt:new Date(), verificationStatus:"EMAIL_VERIFIED" }});
  await prisma.emailVerificationToken.update({ where:{ token }, data:{ usedAt:new Date() }});
  // Check if user has completed onboarding, if not redirect to onboarding
  if (!record.user.onboardingCompleted) {
    redirect("/onboarding?verified=success");
  }
  redirect("/dashboard?verified=success");
}
