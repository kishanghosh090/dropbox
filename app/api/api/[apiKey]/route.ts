import { db } from "@/lib/db";
import { customApis } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ apiKey: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apiKey } = await props.params;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key id must be provided" },
        { status: 400 },
      );
    }

    const [customApiData] = await db
      .select()
      .from(customApis)
      .where(and(eq(customApis.id, apiKey), eq(customApis.userId, userId)))
      .limit(1);

    if (!customApiData) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: customApiData });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 },
    );
  }
}