import { db } from "@/lib/db";
import { customApis, NewCustomApi } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const apiKeyId = formData.get("apiKeyId") as string;
    const formUserId = formData.get("userId") as string;
    if (formUserId != userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!apiKeyId) {
      return NextResponse.json({ error: "API key not found" }, { status: 400 });
    }

    const dbData = await db
      .delete(customApis)
      .where(eq(customApis.id, apiKeyId))
      .returning();
    return NextResponse.json({
      message: "API key deleted successfully",
      key: dbData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API" },
      { status: 500 },
    );
  }
}
