import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;

  console.log("Middleware check - token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    await verifyToken(token);
    console.log("Middleware check - token verified");
    return NextResponse.next();
  } catch {
    console.log("Middleware check - invalid token");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
