import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: { creator: { select: { name: true } } },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
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
    
    const event = await db.event.create({
      data: {
        ...body,
        createdById: session.user.id,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/");
    revalidatePath("/events");

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}