"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Ziada Global
        </Link>
      </nav>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-10">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button className="cursor-pointer w-full bg-black text-white py-2 rounded">Login</button>
    </form>
    </div>
  );
}
