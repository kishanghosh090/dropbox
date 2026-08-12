import { db } from "@/lib/db";
import { customApis, NewCustomApi } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(props: { params: Promise<{ apiKeyId: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { apiKeyId } = await props.params;
    if (!apiKeyId) {
      return NextResponse.json(
        { error: "API key must be provided" },
        { status: 400 },
      );
    }
    const [customApiData] = await db
      .select()
      .from(customApis)
      .where(eq(customApis.id, apiKeyId))
      .limit(1);

    if (!customApiData) {
      return NextResponse.json({ error: "API id not found" }, { status: 400 });
    }
    return NextResponse.json({ data: customApiData });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API" },
      { status: 500 },
    );
  }
}
