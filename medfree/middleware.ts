import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasAdminAccess } from "./lib/admin-config";

// Define protected admin routes
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProfileRoute = createRouteMatcher(["/profile(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Protect admin routes - require authentication and admin email
  if (isAdminRoute(req)) {
    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Fetch user email from Clerk
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses?.[0]?.emailAddress;

      if (!email || !hasAdminAccess(email)) {
        // Unauthorized - redirect to home with error
        const homeUrl = new URL("/", req.url);
        homeUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(homeUrl);
      }
    } catch (error) {
      console.error("Error fetching user in middleware:", error);
      const homeUrl = new URL("/", req.url);
      homeUrl.searchParams.set("error", "auth_error");
      return NextResponse.redirect(homeUrl);
    }
  }

  // Protect profile routes - require authentication only
  if (isProfileRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
