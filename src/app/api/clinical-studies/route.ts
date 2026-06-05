import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const studies = await prisma.platformMetric.findMany({
      where: { category: "CLINICAL_STUDY" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(studies.map((s: { id: string; name: string; value: number }) => ({
      id: s.id,
      name: s.name,
      status: s.value > 0 ? "ACTIVE" : "COMPLETED",
      phase: "Phase II",
      participants: Math.floor(s.value),
    })));
  } catch (error) {
    console.error("Error fetching clinical studies:", error);
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
    
    const study = await prisma.platformMetric.create({
      data: {
        name: body.name,
        value: body.participants,
        category: "CLINICAL_STUDY",
      },
    });

    return NextResponse.json({
      id: study.id,
      name: study.name,
      status: "ACTIVE",
      phase: body.phase || "Phase I",
      participants: study.value,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating clinical study:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}