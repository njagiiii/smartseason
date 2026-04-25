"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createField, getAllAgents } from "@/lib/api";
import { getUser, isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/ui/Navbar";
import toast from "react-hot-toast";

export default function NewFieldPage() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
    agentId: "",
  });

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || user?.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await getAllAgents();
      setAgents(res.data.agents);
    } catch (error: any) {
      toast.error("Failed to load agents");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createField({
        ...form,
        agentId: form.agentId || undefined,
      });
      toast.success("Field created successfully!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create field");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#6B7280] hover:text-[#2D6A4F]"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1B1B1B]">New Field</h1>
            <p className="text-[#6B7280]">Create a new field to monitor</p>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                Field Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="e.g. North Maize Field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                Crop Type
              </label>
              <input
                type="text"
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                className="input"
                placeholder="e.g. Maize, Tea, Coffee"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                Planting Date
              </label>
              <input
                type="date"
                value={form.plantingDate}
                onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                Expected Harvest Date
              </label>
              <input
                type="date"
                value={form.expectedHarvestDate}
                onChange={(e) =>
                  setForm({ ...form, expectedHarvestDate: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1B1B] mb-1">
                Assign Agent (Optional)
              </label>
              <select
                value={form.agentId}
                onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                className="input"
              >
                <option value="">-- Select an agent --</option>
                {agents.map((agent: any) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? "Creating..." : "Create Field"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}