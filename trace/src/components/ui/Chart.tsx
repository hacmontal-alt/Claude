"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function Chart({ data, color = "#EF4623", height = 160 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F4" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8A9BA3" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#8A9BA3" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          contentStyle={{ fontSize: 11, border: "1px solid #E8EAEB", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          formatter={(value) => [`${value}%`, "Visibility"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color.replace("#", "")})`}
          dot={{ r: 3, fill: "#fff", stroke: color, strokeWidth: 1.5 }}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
