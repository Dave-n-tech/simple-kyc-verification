"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Ziada Global
        </Link>
      </nav>
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="cursor-pointer w-full bg-black text-white py-2 rounded">
          Verify
        </button>
      </form>
    </div>
    </div>
  );
}
