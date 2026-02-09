import { prisma } from "@/lib/prisma";
import { KYCStatus } from "../../types";
import KycActions from "./kyc-actions";
import Link from "next/link";
import SignOutButton from "@/app/dashboard/signout-button";

export default async function AdminDashboard() {
  const kycs = await prisma.kYC.findMany({
    where: {
      status: {
        in: [KYCStatus.PENDING, KYCStatus.UNVERIFIED, KYCStatus.VERIFIED],
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingKycs = kycs.filter((k) => k.status === KYCStatus.PENDING);
  const unverifiedKycs = kycs.filter((k) => k.status === KYCStatus.UNVERIFIED);

  const verifiedKycs = kycs.filter((k) => k.status === KYCStatus.VERIFIED);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            Ziada Global
          </Link>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
        <SignOutButton />
      </nav>

      <main className="max-w-5xl mx-auto py-10 px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Pending Section */}
        <section className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Verifications
            </h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingKycs.length} Pending
            </span>
          </div>

          {pendingKycs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No pending verifications found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pendingKycs.map((kyc) => (
                <li
                  key={kyc.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{kyc.fullName}</p>
                    <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                      <span>
                        <span className="font-medium text-gray-700">Type:</span>{" "}
                        {kyc.idType}
                      </span>
                      <span>
                        <span className="font-medium text-gray-700">ID:</span>{" "}
                        {kyc.idNumber}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Submitted: {kyc.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <img
                      src={kyc.documentUrl}
                      alt="KYC Document"
                      className="w-48 h-32 object-cover rounded border"
                    />
                  </div>

                  <KycActions kycId={kyc.id} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Verified Section */}
        <section className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Verified Users
            </h2>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {verifiedKycs.length} Verified
            </span>
          </div>
          {verifiedKycs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No verified users found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {verifiedKycs.map((kyc) => (
                <li
                  key={kyc.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{kyc.fullName}</p>
                    <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                      <span>
                        <span className="font-medium text-gray-700">Type:</span>{" "}
                        {kyc.idType}
                      </span>
                      <span>
                        <span className="font-medium text-gray-700">ID:</span>{" "}
                        {kyc.idNumber}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Submitted: {kyc.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <img
                      src={kyc.documentUrl}
                      alt="KYC Document"
                      className="w-48 h-32 object-cover rounded border"
                    />
                  </div>

                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Unverified Section */}
        {/* <section className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Unverified Users
            </h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unverifiedKycs.length} Unverified
            </span>
          </div>

          {unverifiedKycs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No unverified users found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {unverifiedKycs.map((kyc) => (
                <li
                  key={kyc.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">
                        {kyc.fullName || "N/A"}
                      </p>
                      <div className="text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
                        <span>
                          <span className="font-medium text-gray-700">
                            Type:
                          </span>{" "}
                          {kyc.idType || "-"}
                        </span>
                        <span>
                          <span className="font-medium text-gray-700">ID:</span>{" "}
                          {kyc.idNumber || "-"}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Unverified
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section> */}
      </main>
    </div>
  );
}
