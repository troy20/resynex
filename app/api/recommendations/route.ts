import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { interests: true }
    });

    const interests = userData?.interests || [];

    // If no interests set, return recent items
    if (interests.length === 0) {
      const recentProblems = await prisma.problemPost.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, role: true } } }
      });

      const recentFacilities = await prisma.facilityListing.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, role: true } } }
      });

      return NextResponse.json({
        problems: recentProblems,
        facilities: recentFacilities,
        basedOn: "recent"
      });
    }

    // Get recommended problems based on interests
    const recommendedProblems = await prisma.problemPost.findMany({
      where: {
        OR: [
          { field: { in: interests } },
          { title: { contains: interests[0], mode: "insensitive" } }
        ]
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, role: true } } }
    });

    // Get recommended facilities based on interests
    const recommendedFacilities = await prisma.facilityListing.findMany({
      where: {
        OR: [
          { field: { in: interests } },
          { title: { contains: interests[0], mode: "insensitive" } }
        ]
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { fullName: true, role: true } } }
    });

    return NextResponse.json({
      problems: recommendedProblems,
      facilities: recommendedFacilities,
      basedOn: interests
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}