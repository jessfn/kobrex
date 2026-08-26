"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type Point = { month: string; total: number };

export function IncomeChart({ data }: { data: Point[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--color-text-muted)" }}
          />
          <Tooltip
            cursor={{ fill: "var(--color-surface-muted)" }}
            formatter={(value) => [`$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, "Ingresos"]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              fontSize: 12,
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <Bar dataKey="total" fill="#b91c1c" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
