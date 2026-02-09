"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.firstname || !form.lastname || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Signup failed");
        return;
      }

      const otpRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      if (!otpRes.ok) {
        const data = await otpRes.json();
        setError(data.error || "Failed to send OTP");
        return;
      }

      console.log("Signup successful, OTP sent");

      router.push("/auth/verify-email");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userId={null} userRole={null} />
      <div className="min-h-screen flex items-center justify-center">
        <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Create Account</h2>

          <input
            placeholder="First Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          />

          <input
            placeholder="Last Name"
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          />

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

          {error && <p className="text-red-500">{error}</p>}

          <button
            disabled={loading}
            type="submit"
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full bg-black text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
