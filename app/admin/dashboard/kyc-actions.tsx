"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface KycActionsProps {
  kycId: string;
}

export default function KycActions({ kycId }: KycActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/kyc/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kycId }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || `Failed to ${action} KYC`);
      }
    } catch (error) {
      console.error(`Error during KYC ${action}:`, error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isLoading}
        onClick={() => handleAction("approve")}
        className="cursor-pointer px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Approve
      </button>
      <button
        disabled={isLoading}
        onClick={() => handleAction("reject")}
        className="cursor-pointer px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reject
      </button>
    </div>
  );
}
