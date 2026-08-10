import { auth } from "@clerk/nextjs/server";
import { db } from "../../../lib/db";
import { files } from "../../../lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // parse request body

    const body = await request.json();
    const { imageKit, userId: bodyUserId } = body;

    if (bodyUserId != userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!imageKit || !imageKit.url) {
      return NextResponse.json(
        { error: "invalid file upload" },
        { status: 401 },
      );
    }

    const fileData = {
      name: imageKit.name || "untitled" + `${Date.now()}`,
      path: imageKit.filePath || `dopbox/${userId}/${imageKit.name}`,
      size: imageKit.size || 0,
      type: imageKit.fileType || "image",
      fileUrl: imageKit.url,
      thumbnailUrl: imageKit.thumbnailUrl || null,
      userId: userId,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save info to database" },
      { status: 500 },
    );
  }
}
