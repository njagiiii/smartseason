"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFieldById, updateFieldStage } from "@/lib/api";
import { getUser, isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/ui/Navbar";
import toast from "react-hot-toast";
import { use } from "react";

const STAGES = ["PLANTED", "GROWING", "READY", "HARVESTED"];

export default function AgentFieldDetail({
  params,
}: { params: Promise<{ id: string }> }) {
   const { id } = use(params);
  const router = useRouter();
  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    stage: "",
    notes: "",
  });

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || user?.role !== "AGENT") {
      router.push("/login");
      return;
    }
    fetchField();
  }, []);

  const fetchField = async () => {
    try {
      const res = await getFieldById(id);
      setField(res.data.field);
      setForm({ stage: res.data.field.stage, notes: "" });
    } catch (error: any) {
      toast.error("Failed to load field");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateFieldStage(id, form);
      toast.success("Field updated successfully!");
      fetchField();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update field");
    } finally {
      setUpdating(false);
    }
  };
const statusBadge = (
  {
    ACTIVE: "badge-active",
    AT_RISK: "badge-at-risk",
    COMPLETED: "badge-completed",
  } as Record<string, string>
)[field?.status] || "badge-active";
 
 const stageBadge = (
  {
    PLANTED: "badge-planted",
    GROWING: "badge-growing",
    READY: "badge-ready",
    HARVESTED: "badge-harvested",
  } as Record<string, string>
)[field?.stage] || "badge-planted";


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

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#6B7280] hover:text-[#2D6A4F]"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1B1B1B]">{field?.name}</h1>
            <p className="text-[#6B7280]">{field?.cropType}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Field Info + Update History */}
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-semibold text-[#1B1B1B] mb-4">Field Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-sm">Status</span>
                  <span className={statusBadge}>
                    {field?.status?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-sm">Current Stage</span>
                  <span className={stageBadge}>{field?.stage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-sm">Planting Date</span>
                  <span className="text-sm font-medium">
                    {new Date(field?.plantingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6B7280] text-sm">Expected Harvest</span>
                  <span className="text-sm font-medium">
                    {new Date(field?.expectedHarvestDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Update History */}
            <div className="card">
              <h2 className="font-semibold text-[#1B1B1B] mb-4">Update History</h2>
              {field?.updates?.length === 0 ? (
                <p className="text-[#6B7280] text-sm">No updates yet.</p>
              ) : (
                <div className="space-y-3">
                  {field?.updates?.map((update: any) => (
                    <div
                      key={update.id}
                      className="border-l-2 border-[#52B788] pl-4 py-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{update.stage}</span>
                        <span className="text-xs text-[#6B7280]">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {update.notes && (
                        <p className="text-sm text-[#6B7280] mt-1">
                          {update.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Update Stage Form */}
          <div className="card h-fit">
            <h2 className="font-semibold text-[#1B1B1B] mb-4">Update Field</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                  Stage
                </label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  className="input"
                  required
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                  Notes / Observations
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input min-h-[100px] resize-none"
                  placeholder="e.g. Germination looking good..."
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn-primary w-full"
              >
                {updating ? "Updating..." : "Update Field"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}