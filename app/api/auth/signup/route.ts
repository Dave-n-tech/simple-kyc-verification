import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";
import { KYCStatus } from "@/app/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password } = await req.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: passwordHash,
        kycStatus: KYCStatus.UNVERIFIED,
      },
    });

    const token = await signToken({
      userId: user.id,
      role: user.role,
    })

    const response = NextResponse.json(
      { message: "User created", userId: user.id, role: user.role },
      { status: 201 }
    );

    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/"
    });

    return response;
    
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
