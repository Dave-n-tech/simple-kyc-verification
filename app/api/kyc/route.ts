export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { KYCStatus } from "@/app/types";


export async function GET(req: Request) {
  const kycs = await prisma.kYC.findMany({
      where: {
        status: {
          in: [KYCStatus.PENDING, KYCStatus.UNVERIFIED, KYCStatus.VERIFIED, KYCStatus.REJECTED],
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  return NextResponse.json(kycs);
}