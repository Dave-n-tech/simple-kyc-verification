import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { KYCStatus } from "@prisma/client";
import SignOutButton from "./signout-button";

export default async function Dashboard() {
  const token = (await cookies()).get("auth")?.value!;
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Ziada Global
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <Link href="/" className="text-sm font-medium hover:text-gray-600">
            Home
          </Link>
        </div>
        <SignOutButton />
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.firstname} {user?.lastname}
          </h1>
          <p className="text-gray-500 mb-8">
            Manage your account and verification status.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">KYC Status</h2>
              <div className="mb-4">
                <span className={`inline-block ${user?.kycStatus === KYCStatus.VERIFIED ? "bg-green-100 text-green-800" : user?.kycStatus === KYCStatus.PENDING ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"} px-3 py-1 rounded-full text-sm font-medium`}>
                  {user?.kycStatus || KYCStatus.UNVERIFIED}
                </span>
              </div>
              {user?.kycStatus === KYCStatus.UNVERIFIED && (
                <Link
                  href="/kyc"
                  className="block w-full bg-black text-white py-2 px-4 rounded text-center hover:bg-gray-800 transition-colors"
                >
                  Complete KYC
                </Link>
              )}
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Email Verification</h2>
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.isEmailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user?.isEmailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
              {!user?.isEmailVerified && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Please verify your email to access all features.
                  </p>
                  <Link
                    href="/auth/verify-email"
                    className="block w-full border border-black text-black py-2 px-4 rounded text-center hover:bg-gray-50 transition-colors"
                  >
                    Verify Email
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
