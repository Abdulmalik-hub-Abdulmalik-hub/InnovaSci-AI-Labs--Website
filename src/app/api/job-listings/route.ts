import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.jobListing.findMany({
      include: { 
        createdBy: { select: { name: true } },
        _count: { select: { applications: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings.map(l => ({ ...l, applicants: l._count.applications })));
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const listing = await prisma.jobListing.create({
      data: {
        ...body,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}