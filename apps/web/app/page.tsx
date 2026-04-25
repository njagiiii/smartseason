"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    const user = getUser();
    if (user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/agent/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#6B7280]">Redirecting...</p>
    </div>
  );
}