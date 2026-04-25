"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardSummary, getAllFields } from "@/lib/api";
import { getUser, isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/ui/Navbar";
import StatsCard from "@/components/ui/StatsCard";
import FieldCard from "@/components/ui/FieldCard";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    atRisk: 0,
    completed: 0,
  });
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || user?.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, fieldsRes] = await Promise.all([
        getDashboardSummary(),
        getAllFields(),
      ]);
      setSummary(summaryRes.data.summary);
      setFields(fieldsRes.data.fields);
    } catch (error: any) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7280]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1B1B1B]">Dashboard</h1>
            <p className="text-[#6B7280]">Overview of all fields</p>
          </div>
          <button
            onClick={() => router.push("/admin/fields/new")}
            className="btn-primary"
          >
            + New Field
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Fields" value={summary.total} icon="🌾" color="#2D6A4F" />
          <StatsCard title="Active" value={summary.active} icon="✅" color="#52B788" />
          <StatsCard title="At Risk" value={summary.atRisk} icon="⚠️" color="#F59E0B" />
          <StatsCard title="Completed" value={summary.completed} icon="🏁" color="#6B7280" />
        </div>

        {/* Fields */}
        <div>
          <h2 className="text-lg font-semibold text-[#1B1B1B] mb-4">All Fields</h2>
          {fields.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-4xl mb-3">🌱</p>
              <p className="text-[#6B7280]">No fields yet. Create your first field.</p>
              <button
                onClick={() => router.push("/admin/fields/new")}
                className="btn-primary mt-4"
              >
                + New Field
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field: any) => (
                <FieldCard key={field.id} field={field} role="ADMIN" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}