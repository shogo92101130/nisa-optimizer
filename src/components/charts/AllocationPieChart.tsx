"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, PieLabelRenderProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_FUNDS } from "@/mock/funds";

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

interface Entry { fundId: string; allocation: number }
interface Props { entries: Entry[] }

function renderLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if ((percent ?? 0) < 0.08) return null;
  const cxN = Number(cx ?? 0);
  const cyN = Number(cy ?? 0);
  const irN = Number(innerRadius ?? 0);
  const orN = Number(outerRadius ?? 0);
  const r = irN + (orN - irN) * 0.5;
  const rad = (Number(midAngle ?? 0) * Math.PI) / 180;
  const x = cxN + r * Math.cos(-rad);
  const y = cyN + r * Math.sin(-rad);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

export function AllocationPieChart({ entries }: Props) {
  const data = entries
    .filter((e) => e.allocation > 0)
    .map((e, i) => {
      const fund = MOCK_FUNDS.find((f) => f.id === e.fundId);
      const name = (fund?.name ?? e.fundId)
        .replace("eMAXIS Slim ", "")
        .replace("インデックス", "")
        .replace("・ファンド", "")
        .replace("楽天・", "楽天/")
        .replace("SBI・V・", "SBI/");
      return { name, value: e.allocation, color: COLORS[i % COLORS.length] };
    });

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold">配分</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              labelLine={false}
              label={renderLabel}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${v}%`, ""]}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              formatter={(value: string) => (
                <span style={{ color: "hsl(var(--foreground))", fontSize: "11px" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
