"use client";

import { useRouter } from "next/navigation";
import { logout, getUser } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-[#2D6A4F] text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">🌱</span>
        <span className="font-bold text-lg">SmartSeason</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-green-200">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-[#2D6A4F] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}