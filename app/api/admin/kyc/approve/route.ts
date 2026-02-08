import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { KYCStatus } from "@prisma/client";

export async function POST(req: Request) {
  const { kycId } = await req.json();

  const kyc = await prisma.kYC.update({
    where: { id: kycId },
    data: { status: KYCStatus.VERIFIED },
  });

  await prisma.user.update({
    where: { id: kyc.userId },
    data: { kycStatus: KYCStatus.VERIFIED },
  });

  return NextResponse.json({ message: "KYC approved" });
}