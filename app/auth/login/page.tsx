"use client";

import Navbar from "@/app/components/navbar";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Login failed:", data.error);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userId={null} userRole={null} />
      <div className="min-h-screen flex items-center justify-center">
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Login</h2>

          <input
            placeholder="Email"
            type="email"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="cursor-pointer w-full bg-black text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
