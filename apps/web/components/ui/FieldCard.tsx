"use client";

import { useRouter } from "next/navigation";

interface FieldCardProps {
  field: {
    id: string;
    name: string;
    cropType: string;
    stage: string;
    status: string;
    plantingDate: string;
    expectedHarvestDate: string;
    agent?: {
      name: string;
      email: string;
    };
  };
  role: "ADMIN" | "AGENT";
}

export default function FieldCard({ field, role }: FieldCardProps) {
  const router = useRouter();

  const statusBadge = {
    ACTIVE: "badge-active",
    AT_RISK: "badge-at-risk",
    COMPLETED: "badge-completed",
  }[field.status] || "badge-active";

  const stageBadge = {
    PLANTED: "badge-planted",
    GROWING: "badge-growing",
    READY: "badge-ready",
    HARVESTED: "badge-harvested",
  }[field.stage] || "badge-planted";

  const handleClick = () => {
    if (role === "ADMIN") {
      router.push(`/admin/fields/${field.id}`);
    } else {
      router.push(`/agent/fields/${field.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="card cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-[#52B788]"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#1B1B1B]">{field.name}</h3>
          <p className="text-sm text-[#6B7280]">{field.cropType}</p>
        </div>
        <span className={statusBadge}>
          {field.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={stageBadge}>{field.stage}</span>
      </div>

      <div className="text-xs text-[#6B7280] space-y-1">
        <p>🌱 Planted: {new Date(field.plantingDate).toLocaleDateString()}</p>
        <p>🎯 Expected Harvest: {new Date(field.expectedHarvestDate).toLocaleDateString()}</p>
        {field.agent && (
          <p>👤 Agent: {field.agent.name}</p>
        )}
      </div>
    </div>
  );
}