"use client";

import { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FundSearch } from "./FundSearch";
import { MOCK_FUNDS } from "@/mock/funds";
import type { PortfolioItem } from "@/types";

export function PortfolioForm() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [monthlyAmount, setMonthlyAmount] = useState<string>("30000");
  const [years, setYears] = useState<string>("20");
  const [showSearch, setShowSearch] = useState(false);

  const totalAllocation = portfolio.reduce((s, p) => s + p.allocation, 0);
  const isValid = totalAllocation === 100 && portfolio.length > 0;

  function addFund(fundId: string) {
    if (portfolio.find((p) => p.fundId === fundId)) return;
    const remaining = 100 - totalAllocation;
    setPortfolio((prev) => [...prev, { fundId, allocation: Math.max(0, remaining) }]);
    setShowSearch(false);
  }

  function removeFund(fundId: string) {
    setPortfolio((prev) => prev.filter((p) => p.fundId !== fundId));
  }

  function updateAllocation(fundId: string, value: string) {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setPortfolio((prev) =>
      prev.map((p) => (p.fundId === fundId ? { ...p, allocation: num } : p))
    );
  }

  return (
    <div className="space-y-4">
      {/* Fund Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">銘柄選択</CardTitle>
            <Badge
              variant={totalAllocation === 100 ? "default" : totalAllocation > 100 ? "destructive" : "secondary"}
              className="text-xs"
            >
              合計 {totalAllocation}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolio.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <p className="text-sm">銘柄を追加してください</p>
            </div>
          ) : (
            portfolio.map((item) => {
              const fund = MOCK_FUNDS.find((f) => f.id === item.fundId);
              if (!fund) return null;
              return (
                <div key={item.fundId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{fund.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{fund.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={item.allocation}
                      onChange={(e) => updateAllocation(item.fundId, e.target.value)}
                      className="w-16 h-8 text-center text-sm"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    <button
                      onClick={() => removeFund(item.fundId)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {totalAllocation !== 100 && portfolio.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>配分の合計を100%にしてください（現在{totalAllocation}%）</span>
            </div>
          )}

          {showSearch ? (
            <FundSearch onSelect={addFund} selectedIds={portfolio.map((p) => p.fundId)} />
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

      {/* Simulation Settings */}
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
                onChange={(e) => setMonthlyAmount(e.target.value)}
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
                onChange={(e) => setYears(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">年</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Run Button */}
      <Button
        className="w-full"
        size="lg"
        disabled={!isValid}
      >
        シミュレーション実行
      </Button>
    </div>
  );
}
