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

    const settings = await db.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
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
    
    const setting = await db.systemSetting.upsert({
      where: { key: body.key },
      update: { value: body.value },
      create: {
        key: body.key,
        value: body.value,
        description: body.description,
        updatedBy: session.user.id,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE",
        entityType: "SystemSetting",
        entityId: setting.id,
        details: `Updated setting ${setting.key}`,
      },
    });

    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}