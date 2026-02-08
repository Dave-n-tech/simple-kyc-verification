"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KycPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserId(data.id));
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setDocumentPreview(URL.createObjectURL(selectedFile));
    } else {
      setDocumentPreview(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName || !dob || !idNumber || !idType || !file) {
      setError("Please fill in all fields and upload a document.");
      return;
    }

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dob", dob);
    formData.append("idType", idType);
    formData.append("idNumber", idNumber);
    formData.append("document", file);
    formData.append("userId", userId!);

    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      router.push("/dashboard"); // redirect to dashboard
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">
          Ziada Global
        </Link>
        <div className="h-6 w-px bg-gray-200"></div>
        <Link
          href="/dashboard"
          className="text-sm font-medium hover:text-gray-600"
        >
          Dashboard
        </Link>
      </nav>

      <main className="max-w-xl mx-auto py-10 px-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Complete KYC Verification
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Type
              </label>
              <select
                name="idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select ID Type</option>
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National ID</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Number
              </label>
              <input
                name="idNumber"
                placeholder="Enter your ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                  name="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-black">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>

            {documentPreview && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Document Preview:
                </p>
                <img
                  src={documentPreview}
                  alt="Document Preview"
                  className="w-full h-48 object-contain rounded bg-white border"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-md"
            >
              Submit KYC
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
