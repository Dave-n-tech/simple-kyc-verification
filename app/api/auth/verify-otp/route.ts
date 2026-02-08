import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { otp } = await req.json();

  const record = await prisma.emailVerificationOTP.findFirst({
    where: { token: otp },
    orderBy: { expiresAt: "desc" },
  });

  if (!record) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  // Update user as verified
  await prisma.user.update({
    where: { email: record.email },
    data: { isEmailVerified: true },
  });

  await prisma.emailVerificationOTP.delete({ where: { id: record.id } });

  return NextResponse.json({ message: "Email verified successfully" });
}
