"use client";

import { useState } from "react";
import { Zap, Loader2, TrendingUp, Shield, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { optimizePortfolio, OptimizeGoal, OptimizeResult } from "@/utils/optimization/optimizer";
import { MOCK_FUNDS } from "@/mock/funds";

interface Props {
  fundIds: string[];
  monthlyAmount: number;
  years: number;
}

const GOALS: { value: OptimizeGoal; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "sharpe",   label: "シャープレシオ最大", icon: BarChart2, desc: "リスク対比リターンが最も効率的な配分" },
  { value: "return",   label: "リターン最大",       icon: TrendingUp, desc: "最終資産が最大になる配分" },
  { value: "drawdown", label: "ドローダウン最小",   icon: Shield, desc: "下落リスクを最も抑えた配分" },
];

function pct(n: number) { return `${(n * 100).toFixed(1)}%`; }
function man(n: number) { return `${(n / 10000).toFixed(0)}万円`; }

export function OptimizerSection({ fundIds, monthlyAmount, years }: Props) {
  const [goal, setGoal] = useState<OptimizeGoal>("sharpe");
  const [results, setResults] = useState<OptimizeResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const canRun = fundIds.length >= 2 && monthlyAmount > 0 && years >= 1;

  async function handleOptimize() {
    setIsRunning(true);
    setResults([]);
    await new Promise((r) => setTimeout(r, 50));
    try {
      const res = optimizePortfolio(fundIds, monthlyAmount, years, goal);
      setResults(res);
    } finally {
      setIsRunning(false);
    }
  }

  if (fundIds.length < 2) return null;

  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <CardTitle className="text-sm font-semibold">最適配分探索</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">10%刻みで全組み合わせを試して最適な配分を自動計算します</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 目標選択 */}
        <div className="grid grid-cols-1 gap-1.5">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                goal === g.value ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" : "bg-muted/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <g.icon className="w-3.5 h-3.5 shrink-0" />
              <div>
                <span className="font-semibold">{g.label}</span>
                <span className="opacity-70 ml-1.5">{g.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <Button
          className="w-full" variant="outline"
          disabled={!canRun || isRunning}
          onClick={handleOptimize}
        >
          {isRunning ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />探索中...</>) : (<><Zap className="w-4 h-4 mr-2" />最適配分を探す</>)}
        </Button>

        {/* 結果 */}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">TOP {results.length} 結果</p>
            {results.map((r) => (
              <div key={r.rank} className={`rounded-xl p-3 space-y-2 border ${r.rank === 1 ? "border-yellow-500/30 bg-yellow-500/10" : "border-border bg-muted/20"}`}>
                <div className="flex items-center gap-2">
                  <Badge variant={r.rank === 1 ? "default" : "secondary"} className="text-xs">
                    {r.rank === 1 ? "🏆 1位" : `${r.rank}位`}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    CAGR {pct(r.result.cagr)} · シャープ {r.result.sharpeRatio.toFixed(2)} · DD -{pct(r.result.maxDrawdown)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.portfolio.map((p) => {
                    const fund = MOCK_FUNDS.find((f) => f.id === p.fundId);
                    const name = (fund?.name ?? p.fundId).replace("eMAXIS Slim ", "").replace("インデックス", "").replace("・ファンド", "");
                    return (
                      <span key={p.fundId} className="text-xs bg-background px-2 py-0.5 rounded-full border border-border">
                        {name} <span className="font-bold">{p.allocation}%</span>
                      </span>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {years}年後: <span className="font-semibold text-foreground">{man(r.result.finalAsset)}</span>（元本 {man(r.result.totalPrincipal)}）
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
