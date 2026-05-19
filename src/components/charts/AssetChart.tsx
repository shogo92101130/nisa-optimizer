"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyRecord } from "@/types";

interface Props {
  records: MonthlyRecord[];
}

function formatYen(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return `${v}`;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  const year = Math.ceil((label ?? 0) / 12);
  const month = (label ?? 0) % 12 || 12;
  return (
    <div className="bg-background border border-border rounded-xl p-3 shadow-lg text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{year}年{month}ヶ月目</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ¥{new Intl.NumberFormat("ja-JP").format(Math.round(p.value))}
        </p>
      ))}
    </div>
  );
}

export function AssetChart({ records }: Props) {
  // 月次データが多い場合は間引く（グラフ描画最適化）
  const step = records.length > 120 ? 6 : records.length > 60 ? 3 : 1;
  const data = records
    .filter((_, i) => i % step === 0 || i === records.length - 1)
    .map((r) => ({
      month: r.month,
      資産総額: Math.round(r.totalAsset),
      元本: Math.round(r.principal),
      利益: Math.max(0, Math.round(r.profit)),
    }));

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold">資産推移</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => `${Math.round(v / 12)}y`}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatYen}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            <Area
              type="monotone"
              dataKey="元本"
              stroke="#94a3b8"
              strokeWidth={1.5}
              fill="url(#gradPrincipal)"
            />
            <Area
              type="monotone"
              dataKey="資産総額"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
