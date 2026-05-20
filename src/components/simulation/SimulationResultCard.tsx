"use client";

import { TrendingUp, TrendingDown, BarChart2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeSimulation } from "@/utils/finance/advice";
import type { SimulationResult } from "@/types";

interface Props {
  result: SimulationResult;
  years: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("ja-JP").format(Math.round(n));
}

function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}

function MetricRow({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right">
        <span
          className={`text-sm font-semibold ${
            positive === true
              ? "text-emerald-500"
              : positive === false
              ? "text-red-400"
              : "text-foreground"
          }`}
        >
          {value}
        </span>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function SimulationResultCard({ result, years }: Props) {
  const profitRate = result.totalReturn;
  const isProfit = result.totalProfit >= 0;
  const advice = analyzeSimulation(result);

  const riskColor =
    advice.riskLevel === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" :
    advice.riskLevel === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  return (
    <div className="space-y-3">
      {/* 一言コメント */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${riskColor}`}>
        <span className="text-xl">{advice.emoji}</span>
        <div>
          <p className="text-sm font-bold">{advice.headline}</p>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{advice.detail}</p>
        </div>
      </div>

      {/* メイン結果 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <p className="text-xs text-muted-foreground mb-1">{years}年後の予想資産</p>
          <p className="text-3xl font-bold tracking-tight">
            ¥{fmt(result.finalAsset)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={isProfit ? "default" : "destructive"}
              className="text-xs"
            >
              {isProfit ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {isProfit ? "+" : ""}
              {pct(profitRate)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              元本 ¥{fmt(result.totalPrincipal)} → 利益{" "}
              <span className={isProfit ? "text-emerald-500" : "text-red-400"}>
                {isProfit ? "+" : ""}¥{fmt(result.totalProfit)}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 詳細指標 */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            パフォーマンス指標
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <MetricRow
            label="CAGR（年平均成長率）"
            value={pct(result.cagr)}
            positive={result.cagr >= 0}
          />
          <MetricRow
            label="シャープレシオ"
            value={result.sharpeRatio.toFixed(2)}
            sub="1.0以上が良好"
            positive={result.sharpeRatio >= 1}
          />
          <MetricRow
            label="最大ドローダウン"
            value={pct(result.maxDrawdown)}
            sub="下落幅の最大値"
            positive={false}
          />
          <MetricRow
            label="ボラティリティ（年率）"
            value={pct(result.volatility)}
          />
          <MetricRow
            label="トータルリターン"
            value={pct(result.totalReturn)}
            positive={result.totalReturn >= 0}
          />
        </CardContent>
      </Card>

      {/* リスク警告 */}
      {result.maxDrawdown > 0.3 && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 text-xs">
          <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            最大ドローダウンが{pct(result.maxDrawdown)}と高めです。リスク分散を検討してください。
          </span>
        </div>
      )}
    </div>
  );
}
