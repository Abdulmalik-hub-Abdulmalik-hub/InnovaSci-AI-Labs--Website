import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const datasets = await db.dataset.findMany({
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(datasets);
  } catch (error) {
    console.error("Error fetching datasets:", error);
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
    
    const dataset = await db.dataset.create({
      data: {
        ...body,
        uploadedById: session.user.id,
      },
    });

    return NextResponse.json(dataset, { status: 201 });
  } catch (error) {
    console.error("Error creating dataset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}