import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/helpers";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email } = await req.json();
  const otp = generateOTP();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.emailVerificationOTP.create({
    data: {
      userId: user.id,
      email: email as string,
      token: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    },
  });

  console.log("OTP (mock email):", otp);

  // send email with nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return Response.json(
      { error: "Failed to send OTP email" },
      { status: 500 },
    );
  }

  return Response.json({ message: "OTP sent", otp });
}
