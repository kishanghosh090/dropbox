import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "sign-in(.*)", "sign-up(.*)"]);
export default clerkMiddleware(async (auth, request) => {
  const user = await auth();
  const userId = (await user).userId;
  const url = new URL(request.url);
  if (userId && isPublicRoute(request) && url.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // protect non-public routes
  if (!isPublicRoute(request) && !userId) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
