interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
        style={{ backgroundColor: color + "20" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[#6B7280] text-sm">{title}</p>
        <p className="text-2xl font-bold text-[#1B1B1B]">{value}</p>
      </div>
    </div>
  );
}