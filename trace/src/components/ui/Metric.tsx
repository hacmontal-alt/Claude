"use client";

interface MetricProps {
  label: string;
  value: string;
  change?: string;
  sub?: string;
  small?: boolean;
}

export default function Metric({ label, value, change, sub, small }: MetricProps) {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  return (
    <div className={`bg-white border border-[#E8EAEB] rounded-lg flex-1 ${small ? "p-2.5 min-w-[90px]" : "p-3.5 min-w-[130px]"}`}>
      <div className="text-[10px] text-[#8A9BA3] uppercase tracking-wider mb-1 font-medium">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className={`font-bold text-[#2D3B42] ${small ? "text-lg" : "text-2xl"}`}>{value}</span>
        {change && (
          <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5
            ${isPositive ? "text-[#047857] bg-[#ECFDF5]" : ""}
            ${isNegative ? "text-[#DC2626] bg-[#FEF2F2]" : ""}
            ${!isPositive && !isNegative ? "text-[#8A9BA3]" : ""}
          `}>
            {change}
          </span>
        )}
      </div>
      {sub && <div className="text-[9px] text-[#8A9BA3] mt-0.5">{sub}</div>}
    </div>
  );
}
