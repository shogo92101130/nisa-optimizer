"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyRecord } from "@/types";

interface Props { records: MonthlyRecord[] }

export function AnnualReturnChart({ records }: Props) {
  // 月次レコードから年次リターンを計算
  const data: { year: string; return: number }[] = [];
  for (let y = 0; y < Math.floor(records.length / 12); y++) {
    const start = y === 0 ? records[0].totalAsset - records[0].profit : records[y * 12 - 1].totalAsset;
    const end = records[Math.min((y + 1) * 12 - 1, records.length - 1)].totalAsset;
    const ret = start > 0 ? ((end - start) / start) * 100 : 0;
    data.push({ year: `${y + 1}年目`, return: parseFloat(ret.toFixed(2)) });
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold">年次リターン</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 8)} />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={36} />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Tooltip
              formatter={(v) => [`${Number(v).toFixed(2)}%`, "年次リターン"]}
              contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
            />
            <Bar dataKey="return" radius={[3, 3, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.return >= 0 ? "#10b981" : "#ef4444"} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
