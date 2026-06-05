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

    const runs = await prisma.trainingRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching training runs:", error);
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
    
    const run = await prisma.trainingRun.create({
      data: {
        ...body,
        startTime: new Date(),
      },
    });

    return NextResponse.json(run, { status: 201 });
  } catch (error) {
    console.error("Error creating training run:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}