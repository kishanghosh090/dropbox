import { db } from "@/lib/db";
import { customApis, NewCustomApi } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const formUserId = formData.get("userId") as string;
    if (formUserId != userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!name) {
      return NextResponse.json(
        { error: "API name must be provided" },
        { status: 400 },
      );
    }
    const data: NewCustomApi = {
      userId: userId,
      name: name,
      apiKey: uuidv4(),
    };
    const dbData = await db.insert(customApis).values(data).returning();
    return NextResponse.json(dbData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create API" },
      { status: 500 },
    );
  }
}
