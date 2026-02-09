import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get("auth")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, firstname: true, lastname: true, email: true, role: true, kycStatus: true },
  });

  return NextResponse.json(user);
}
