import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Update user basic info
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: data.fullName,
        bio: data.bio,
        country: data.country,
        city: data.city,
        avatarUrl: data.avatarUrl,
      },
    });

    // Update profile-specific data based on role
    const profileData = {
      skills: data.skills || [],
      qualifications: data.qualifications || [],
      experience: data.experience,
    };

    switch (user.role) {
      case "ACADEMIC":
        await prisma.academicProfile.upsert({
          where: { userId: user.id },
          update: {
            ...profileData,
            institutionName: data.institutionName,
            institutionalEmail: data.institutionalEmail,
            department: data.department,
            title: data.title,
            orcidUrl: data.orcidUrl,
            publicationsUrl: data.publicationsUrl,
          },
          create: {
            userId: user.id,
            ...profileData,
            institutionName: data.institutionName || "",
            institutionalEmail: data.institutionalEmail || "",
            department: data.department,
            title: data.title,
            orcidUrl: data.orcidUrl,
            publicationsUrl: data.publicationsUrl,
          },
        });
        break;

      case "STUDENT":
        await prisma.studentProfile.upsert({
          where: { userId: user.id },
          update: {
            ...profileData,
            universityName: data.universityName,
            degreeLevel: data.degreeLevel,
            major: data.major,
            graduationYear: data.graduationYear,
          },
          create: {
            userId: user.id,
            ...profileData,
            universityName: data.universityName,
            degreeLevel: data.degreeLevel,
            major: data.major,
            graduationYear: data.graduationYear,
          },
        });
        break;

      case "INDUSTRY":
        await prisma.industryProfile.upsert({
          where: { userId: user.id },
          update: {
            ...profileData,
            legalCompanyName: data.legalCompanyName,
            tradingName: data.tradingName,
            abn: data.abn,
            companyRegistrationNumber: data.companyRegistrationNumber,
            websiteUrl: data.websiteUrl,
            sector: data.sector,
            headquartersCountry: data.headquartersCountry,
          },
          create: {
            userId: user.id,
            ...profileData,
            legalCompanyName: data.legalCompanyName || "",
            tradingName: data.tradingName,
            abn: data.abn,
            companyRegistrationNumber: data.companyRegistrationNumber,
            websiteUrl: data.websiteUrl,
            sector: data.sector,
            headquartersCountry: data.headquartersCountry,
          },
        });
        break;

      case "UNIVERSITY":
        await prisma.universityProfile.upsert({
          where: { userId: user.id },
          update: {
            ...profileData,
            officialUniversityName: data.officialUniversityName,
            facultyOrDepartment: data.facultyOrDepartment,
            institutionalEmail: data.institutionalEmail,
            officialWebsite: data.officialWebsite,
            country: data.country,
            campusLocation: data.campusLocation,
          },
          create: {
            userId: user.id,
            ...profileData,
            officialUniversityName: data.officialUniversityName || "",
            facultyOrDepartment: data.facultyOrDepartment,
            institutionalEmail: data.institutionalEmail || "",
            officialWebsite: data.officialWebsite,
            country: data.country,
            campusLocation: data.campusLocation,
          },
        });
        break;

      case "STARTUP":
        await prisma.startupProfile.upsert({
          where: { userId: user.id },
          update: {
            ...profileData,
            startupName: data.startupName,
            stage: data.stage,
            sector: data.sector,
            websiteUrl: data.websiteUrl,
            country: data.country,
            description: data.bio,
          },
          create: {
            userId: user.id,
            ...profileData,
            startupName: data.startupName || "",
            stage: data.stage,
            sector: data.sector,
            websiteUrl: data.websiteUrl,
            country: data.country,
            description: data.bio,
          },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}