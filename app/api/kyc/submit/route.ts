export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const dob = formData.get("dob") as string;
    const idType = formData.get("idType") as string;
    const idNumber = formData.get("idNumber") as string;
    const userId = formData.get("userId") as string;
    const document = formData.get("document") as File;

    if (!fullName || !dob || !idType || !idNumber || !document || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert File → Buffer
    const bytes = await document.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "fintech-kyc",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "PENDING" },
    });

    // Create KYC record
    await prisma.kYC.create({
      data: {
        userId,
        fullName,
        dateOfBirth: new Date(dob),
        idType,
        idNumber,
        documentUrl: uploadResult.secure_url,
        status: "PENDING",
      },
    });

    return NextResponse.json({ message: "KYC submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
