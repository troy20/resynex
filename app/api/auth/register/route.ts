import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }
    
    const data = parsed.data;
    const role = data.role;

    // Check if email already exists
    const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (exists) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Determine verification status based on role
    // University and Industry require admin approval
    const needsApproval = role === "UNIVERSITY" || role === "INDUSTRY";
    const verificationStatus = needsApproval ? "PENDING_APPROVAL" : "UNVERIFIED";

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        passwordHash,
        role,
        verificationStatus,
        onboardingCompleted: !needsApproval, // Personal users need to complete onboarding
      }
    });

    // Create role-specific profile
    if (role === "ACADEMIC") {
      await prisma.academicProfile.create({
        data: {
          userId: user.id,
          institutionName: data.institutionName!,
          institutionalEmail: data.email,
          department: data.department,
          title: data.title,
          researchFields: data.researchFields ? data.researchFields.split(",").map((s) => s.trim()) : [],
        },
      });
    } else if (role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          universityName: data.universityName,
          degreeLevel: data.degreeLevel,
          major: data.major,
          skills: [],
          interests: [],
        },
      });
    } else if (role === "INDUSTRY") {
      await prisma.industryProfile.create({
        data: {
          userId: user.id,
          legalCompanyName: data.legalCompanyName!,
          abn: data.abn,
          companyRegistrationNumber: data.companyRegistrationNumber,
          websiteUrl: data.websiteUrl,
          sector: data.sector,
          businessEmail: data.businessEmail || data.email,
          contactPersonName: data.contactPersonName,
        },
      });
    } else if (role === "UNIVERSITY") {
      await prisma.universityProfile.create({
        data: {
          userId: user.id,
          officialUniversityName: data.officialUniversityName!,
          institutionalEmail: data.institutionalEmail || data.email,
          officialWebsite: data.websiteUrl,
          facultyOrDepartment: data.department,
          contactPersonName: data.contactPersonName,
        },
      });
    } else if (role === "STARTUP") {
      await prisma.startupProfile.create({
        data: {
          userId: user.id,
          startupName: data.startupName!,
          stage: data.stage,
          sector: data.sector,
          websiteUrl: data.websiteUrl,
        },
      });
    }

    // Send verification email only for personal users (not for approval-needed users)
    if (!needsApproval) {
      const token = randomBytes(32).toString("hex");
      await prisma.emailVerificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
      await sendVerificationEmail(user.email, token);
    }

    return NextResponse.json({
      ok: true,
      message: needsApproval
        ? "Account created! Your account is pending approval."
        : "Account created. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
