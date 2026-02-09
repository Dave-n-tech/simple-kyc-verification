import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { kycId } = await req.json();

  const kyc = await prisma.kYC.update({
    where: { id: kycId },
    data: { status: "REJECTED" },
  });

  await prisma.user.update({
    where: { id: kyc.userId },
    data: { kycStatus: "REJECTED" },
  });

  return NextResponse.json({ message: "KYC rejected" });
}