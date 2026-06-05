import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const articles = await db.newsArticle.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching news:", error);
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
    
    const article = await db.newsArticle.create({
      data: {
        ...body,
        authorId: session.user.id,
        status: body.status || "DRAFT",
      },
    });

    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}