import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({
      where: { slug },
      include: { versions: { orderBy: { releasedAt: "desc" } } },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const product = await db.product.update({
      where: { slug },
      data: body,
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}