export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { KYCStatus } from "@/app/types";


export async function POST(req: Request) {
  const { kycId } = await req.json();

  if (!kycId) {
    return NextResponse.json(
      { error: "Missing kycId" },
      { status: 400 }
    );
  }

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