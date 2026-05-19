"use client";

import { useState } from "react";
import { Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FundSearch } from "./FundSearch";
import { SimulationResultCard } from "@/components/simulation/SimulationResultCard";
import { MOCK_FUNDS } from "@/mock/funds";
import { runSimulation } from "@/utils/finance/calculations";
import { NISA_LIMITS } from "@/constants/nisa";
import type { SimulationResult, NisaSettings } from "@/types";

// 入力用に allocation を文字列で管理（"080"問題を防ぐため）
type PortfolioEntry = { fundId: string; allocationStr: string };

export function PortfolioForm() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [monthlyAmount, setMonthlyAmount] = useState("30000");
  const [years, setYears] = useState("20");
  const [showSearch, setShowSearch] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const nisa: NisaSettings = { type: "tsumitate", annualLimit: NISA_LIMITS.tsumitate };

  // 合計を数値で計算
  const totalAllocation = entries.reduce((s, e) => s + (parseInt(e.allocationStr, 10) || 0), 0);

  const isValid =
    entries.length > 0 &&
    totalAllocation === 100 &&
    Number(monthlyAmount) > 0 &&
    Number(years) >= 1;

  function addFund(fundId: string) {
    if (entries.find((e) => e.fundId === fundId)) return;
    const remaining = Math.max(0, 100 - totalAllocation);
    setEntries((prev) => [...prev, { fundId, allocationStr: String(remaining) }]);
    setShowSearch(false);
    setResult(null);
  }

  function removeFund(fundId: string) {
    setEntries((prev) => prev.filter((e) => e.fundId !== fundId));
    setResult(null);
  }

  function handleAllocationChange(fundId: string, raw: string) {
    // 先頭の余分なゼロを除去しつつ空文字は許容
    const cleaned = raw === "" ? "" : String(Math.min(100, Math.max(0, parseInt(raw, 10) || 0)));
    setEntries((prev) =>
      prev.map((e) => (e.fundId === fundId ? { ...e, allocationStr: cleaned } : e))
    );
    setResult(null);
  }

  async function handleRun() {
    if (!isValid) return;
    setIsRunning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 0));
    try {
      const portfolio = entries.map((e) => ({
        fundId: e.fundId,
        allocation: parseInt(e.allocationStr, 10) || 0,
      }));
      const res = runSimulation({
        portfolio,
        monthlyAmount: Number(monthlyAmount),
        years: Number(years),
        nisa,
        initialAmount: 0,
      });
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* 銘柄選択 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">銘柄選択</CardTitle>
            <Badge
              variant={
                totalAllocation === 100
                  ? "default"
                  : totalAllocation > 100
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              合計 {totalAllocation}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <p className="text-sm">銘柄を追加してください</p>
            </div>
          ) : (
            entries.map((entry) => {
              const fund = MOCK_FUNDS.find((f) => f.id === entry.fundId);
              if (!fund) return null;
              return (
                <div
                  key={entry.fundId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{fund.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground">{fund.category}</span>
                      <Badge variant="outline" className="text-xs py-0 h-4">
                        {fund.nisaType === "both" ? "つみたて・成長" : "成長投資枠"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={entry.allocationStr}
                      onChange={(e) => handleAllocationChange(entry.fundId, e.target.value)}
                      onFocus={(e) => e.target.select()} // 全選択で"080"問題を解消
                      className="w-16 h-8 text-center text-sm"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    <button
                      onClick={() => removeFund(entry.fundId)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {totalAllocation !== 100 && entries.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>合計を100%にしてください（現在 {totalAllocation}%）</span>
            </div>
          )}

          {showSearch ? (
            <FundSearch
              onSelect={addFund}
              selectedIds={entries.map((e) => e.fundId)}
            />
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              銘柄を追加
            </button>
          )}
        </CardContent>
      </Card>

      {/* 積立設定 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">積立設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">月々の積立額</Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                value={monthlyAmount}
                onChange={(e) => { setMonthlyAmount(e.target.value); setResult(null); }}
                onFocus={(e) => e.target.select()}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">円</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">積立期間</Label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => { setYears(e.target.value); setResult(null); }}
                onFocus={(e) => e.target.select()}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">年</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 実行ボタン */}
      <Button
        className="w-full"
        size="lg"
        disabled={!isValid || isRunning}
        onClick={handleRun}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            計算中...
          </>
        ) : (
          "シミュレーション実行"
        )}
      </Button>

      {/* 結果表示 */}
      {result && <SimulationResultCard result={result} years={Number(years)} />}
    </div>
  );
}
