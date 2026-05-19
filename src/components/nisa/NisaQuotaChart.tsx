"use client";

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { YearlyRecord } from "@/utils/finance/nisaQuota";
import { NISA_LIMITS } from "@/constants/nisa";

interface Props {
  records: YearlyRecord[];
}

function fmtMan(v: number) {
  return `${(v / 10_000).toFixed(0)}万`;
}

export function NisaQuotaChart({ records }: Props) {
  const data = records.map((r) => ({
    year: `${r.year}年目`,
    "つみたて枠": Math.round(r.tsumitateUsed / 10_000),
    "成長投資枠": Math.round(r.seichohUsed / 10_000),
    "合計": Math.round(r.totalUsed / 10_000),
  }));

  const tLimit     = NISA_LIMITS.tsumitate_lifetime / 10_000;
  const totalLimit = NISA_LIMITS.lifetime / 10_000;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-semibold">NISA枠 累計消化推移</CardTitle>
        <p className="text-xs text-muted-foreground">
          つみたて生涯1,200万 ／ 成長生涯1,200万 ／ 合計1,800万
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradTsumi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSeichoh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false} axisLine={false}
              interval={4}
            />
            <YAxis
              tickFormatter={fmtMan}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false} axisLine={false}
              width={44}
            />
            <Tooltip
              formatter={(v, name) => [`${v}万円`, name]}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />

            {/* 上限ライン */}
            <ReferenceLine y={tLimit}     stroke="#3b82f6" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "つみたて上限", fontSize: 9, fill: "#3b82f6", position: "insideTopRight" }} />
            <ReferenceLine y={totalLimit} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: "生涯上限", fontSize: 9, fill: "#f59e0b", position: "insideTopRight" }} />

            <Area type="monotone" dataKey="つみたて枠" stroke="#3b82f6" strokeWidth={2} fill="url(#gradTsumi)" />
            <Area type="monotone" dataKey="成長投資枠" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradSeichoh)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
