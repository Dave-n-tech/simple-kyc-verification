import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/helpers";

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
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    }
  })

  console.log("OTP (mock email):", otp);

  return Response.json({ message: "OTP sent", otp });
}
