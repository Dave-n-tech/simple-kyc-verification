"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/navbar";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.id);
        setUserRole(data.role);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userId={userId} userRole={userRole} />

      <main className="grow flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-12 max-w-xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Future of Secure Finance
          </h1>

          <p className="text-lg text-gray-600 mb-10">
            Ziada Global helps you onboard users safely with industry-standard
            authentication and KYC verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>

            <Link
              href="/auth/login"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
