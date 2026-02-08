import Link from "next/link";
import { Role } from "@prisma/client";

export default function Navbar({
  userId,
  userRole,
}: {
  userId: string | null;
  userRole: Role | null;
}) {
  return (
    <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl">
        Ziada Global
      </Link>

      {userId ? (
        <Link
          href={userRole === Role.ADMIN ? "/admin/dashboard" : "/dashboard"}
          className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Admin Login
          </Link>

          <Link
            href="/auth/signup"
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
