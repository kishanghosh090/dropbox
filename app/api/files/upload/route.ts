import { db } from "@/lib/db";
import { CustomApi, customApis, files, NewCustomApi } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// imagekit credentials
const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    // parse form data
    const customApiKey = (formData.get("apiKey") as string) || null;

    const { userId } = await auth();

    if (!userId && !customApiKey)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let dataFromCustomApiKey: CustomApi | null = null;
    if (customApiKey) {
      [dataFromCustomApiKey] = await db
        .select()
        .from(customApis)
        .where(eq(customApis.apiKey, customApiKey))
        .limit(1);
      if (!dataFromCustomApiKey) {
        return NextResponse.json(
          { error: "API key not valid" },
          { status: 400 },
        );
      }
    }

    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;
    console.log(parentId);

    console.log(formUserId == userId);

    if (formUserId != userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "no file provided" }, { status: 401 });
    }

    if (parentId) {
      const parentFolder = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.userId, formUserId),
            eq(files.parentId, parentId),
            // eq(files.isFolder, true),
          ),
        );
      console.log(parentFolder);

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 400 },
        );
      }
    }

    if (!file.type.startsWith("image") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "unsupported file!" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const folderPath = parentId
      ? `/dropbox/${userId ? userId : uuidv4()}/folder/${parentId}`
      : `/dropbox/${userId ? userId : uuidv4()}`;
    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop() || "";
    //validation for not storing exe, php

    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const uploadResponse = await imageKit.upload({
      file: fileBuffer,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
    });
    const fileData = {
      name: originalFileName,
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      userId: dataFromCustomApiKey ? dataFromCustomApiKey.userId : userId,
      parentId: parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
