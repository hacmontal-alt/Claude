"use client";

const colorMap: Record<string, [string, string]> = {
  green: ["bg-[#ECFDF5]", "text-[#047857]"],
  purple: ["bg-[#F5F3FF]", "text-[#7C3AED]"],
  orange: ["bg-[#FFFBEB]", "text-[#B45309]"],
  cyan: ["bg-[#ECFEFF]", "text-[#0891B2]"],
  coral: ["bg-[#FDF1EE]", "text-[#EF4623]"],
  red: ["bg-[#FEF2F2]", "text-[#DC2626]"],
  gray: ["bg-[#F0F0F4]", "text-[#4A5D66]"],
};

interface TagProps {
  label: string;
  color?: string;
  small?: boolean;
}

export default function Tag({ label, color = "gray", small }: TagProps) {
  const [bg, fg] = colorMap[color] || colorMap.gray;
  return (
    <span className={`font-medium rounded whitespace-nowrap ${bg} ${fg} ${small ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"}`}>
      {label}
    </span>
  );
}
