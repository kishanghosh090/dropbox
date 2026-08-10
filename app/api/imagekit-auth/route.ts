import { auth } from "@clerk/nextjs/server";
import { NextResponse as Response } from "next/server";
import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) Response.json({ error: "Unauthorized" }, { status: 401 });

    const authParams = imageKit.getAuthenticationParameters();

    return Response.json(authParams);
  } catch (error) {
    return Response.json(
      { error: "Failed to generate auth parameters" },
      { status: 500 },
    );
  }
}
