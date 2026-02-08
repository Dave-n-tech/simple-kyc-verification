"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
    >
      Sign Out
    </button>
  );
}
