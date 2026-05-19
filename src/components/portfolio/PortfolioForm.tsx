"use client";

import { useState } from "react";
import { Plus, Trash2, AlertCircle, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FundSearch } from "./FundSearch";
import { RecommendCards } from "./RecommendCards";
import { MOCK_FUNDS } from "@/mock/funds";
import { runSimulation, mergeQuotaConfigs } from "@/utils/finance/calculations";
import { NISA_LIMITS } from "@/constants/nisa";
import type { RecommendProfile } from "@/constants/recommendations";
import type { SimulationResult } from "@/types";

type Entry = { fundId: string; allocationStr: string };

interface Props {
  onSimulationComplete: (
    result: SimulationResult,
    years: number,
    entries: { fundId: string; allocation: number }[]
  ) => void;
}

export function PortfolioForm({ onSimulationComplete }: Props) {
  const [tsumiEntries, setTsumiEntries] = useState<Entry[]>([]);
  const [tsumiMonthly, setTsumiMonthly] = useState("30000");
  const [seichohEntries, setSeichohEntries] = useState<Entry[]>([]);
  const [seichohMonthly, setSeichohMonthly] = useState("0");
  const [years, setYears] = useState("20");
  const [showSearch, setShowSearch] = useState<"tsumi" | "seichoh" | null>(null);
  const [showRecommend, setShowRecommend] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // 各枠の合計配分
  const tsumiTotal   = tsumiEntries.reduce((s, e)   => s + (parseInt(e.allocationStr, 10) || 0), 0);
  const seichohTotal = seichohEntries.reduce((s, e) => s + (parseInt(e.allocationStr, 10) || 0), 0);

  // 年間消化額
  const tsumiAnnual   = (Number(tsumiMonthly) || 0) * 12;
  const seichohAnnual = (Number(seichohMonthly) || 0) * 12;
  const totalMonthly  = (Number(tsumiMonthly) || 0) + (Number(seichohMonthly) || 0);

  const tsumiValid   = tsumiEntries.length === 0 || tsumiTotal === 100;
  const seichohValid = seichohEntries.length === 0 || seichohTotal === 100;
  const hasAnyFund   = tsumiEntries.length > 0 || seichohEntries.length > 0;
  const isValid = hasAnyFund && tsumiValid && seichohValid && totalMonthly > 0 && Number(years) >= 1;

  // おすすめ適用（つみたて枠に入れる）
  function applyRecommend(profile: RecommendProfile) {
    setTsumiEntries(profile.allocations.map((a) => ({ fundId: a.fundId, allocationStr: String(a.allocation) })));
    setShowRecommend(false);
  }

  function addFund(target: "tsumi" | "seichoh", fundId: string) {
    const entries = target === "tsumi" ? tsumiEntries : seichohEntries;
    const setEntries = target === "tsumi" ? setTsumiEntries : setSeichohEntries;
    const total = target === "tsumi" ? tsumiTotal : seichohTotal;
    if (entries.find((e) => e.fundId === fundId)) return;
    const remaining = Math.max(0, 100 - total);
    setEntries((prev) => [...prev, { fundId, allocationStr: String(remaining) }]);
    setShowSearch(null);
  }

  function removeFund(target: "tsumi" | "seichoh", fundId: string) {
    const setter = target === "tsumi" ? setTsumiEntries : setSeichohEntries;
    setter((prev) => prev.filter((e) => e.fundId !== fundId));
  }

  function updateAllocation(target: "tsumi" | "seichoh", fundId: string, raw: string) {
    const setter = target === "tsumi" ? setTsumiEntries : setSeichohEntries;
    const cleaned = raw === "" ? "" : String(Math.min(100, Math.max(0, parseInt(raw, 10) || 0)));
    setter((prev) => prev.map((e) => (e.fundId === fundId ? { ...e, allocationStr: cleaned } : e)));
  }

  async function handleRun() {
    if (!isValid) return;
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 0));
    try {
      const tsumi   = { fundEntries: tsumiEntries.map((e) => ({ fundId: e.fundId, allocation: parseInt(e.allocationStr, 10) || 0 })), monthlyAmount: Number(tsumiMonthly) || 0 };
      const seichoh = { fundEntries: seichohEntries.map((e) => ({ fundId: e.fundId, allocation: parseInt(e.allocationStr, 10) || 0 })), monthlyAmount: Number(seichohMonthly) || 0 };
      const { portfolio, totalMonthly: tm } = mergeQuotaConfigs(tsumi, seichoh);
      const res = runSimulation({ portfolio, monthlyAmount: tm, years: Number(years), nisa: { type: "both", annualLimit: NISA_LIMITS.total_annual }, initialAmount: 0 });
      onSimulationComplete(res, Number(years), portfolio);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* おすすめ */}
      <Card>
        <button className="w-full" onClick={() => setShowRecommend((v) => !v)}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <CardTitle className="text-sm font-semibold">年代別おすすめ</CardTitle>
              </div>
              {showRecommend ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </CardHeader>
        </button>
        {showRecommend && (
          <CardContent className="pt-0">
            <RecommendCards onApply={applyRecommend} />
          </CardContent>
        )}
      </Card>

      {/* つみたて投資枠 */}
      <QuotaCard
        title="つみたて投資枠"
        color="blue"
        annualLimit={NISA_LIMITS.tsumitate}
        entries={tsumiEntries}
        total={tsumiTotal}
        monthly={tsumiMonthly}
        annualUsed={tsumiAnnual}
        onMonthlyChange={setTsumiMonthly}
        onAddClick={() => setShowSearch(showSearch === "tsumi" ? null : "tsumi")}
        onRemove={(id) => removeFund("tsumi", id)}
        onAllocationChange={(id, v) => updateAllocation("tsumi", id, v)}
        showSearch={showSearch === "tsumi"}
        onSelectFund={(id) => addFund("tsumi", id)}
        nisaType="both"
      />

      {/* 成長投資枠 */}
      <QuotaCard
        title="成長投資枠"
        color="violet"
        annualLimit={NISA_LIMITS.seichoh}
        entries={seichohEntries}
        total={seichohTotal}
        monthly={seichohMonthly}
        annualUsed={seichohAnnual}
        onMonthlyChange={setSeichohMonthly}
        onAddClick={() => setShowSearch(showSearch === "seichoh" ? null : "seichoh")}
        onRemove={(id) => removeFund("seichoh", id)}
        onAllocationChange={(id, v) => updateAllocation("seichoh", id, v)}
        showSearch={showSearch === "seichoh"}
        onSelectFund={(id) => addFund("seichoh", id)}
        nisaType="seichoh"
      />

      {/* 積立期間 */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">積立期間</Label>
            <div className="relative flex-1">
              <Input
                type="number" min={1} max={50} value={years}
                onChange={(e) => setYears(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">年</span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">月額合計</p>
              <p className="text-sm font-bold">{totalMonthly.toLocaleString()}円</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 実行ボタン */}
      <Button className="w-full" size="lg" disabled={!isValid || isRunning} onClick={handleRun}>
        {isRunning ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />計算中...</>) : "シミュレーション実行"}
      </Button>
    </div>
  );
}

// ── 枠ごとのカード ──────────────────────────────────────────────

interface QuotaCardProps {
  title: string;
  color: "blue" | "violet";
  annualLimit: number;
  entries: Entry[];
  total: number;
  monthly: string;
  annualUsed: number;
  onMonthlyChange: (v: string) => void;
  onAddClick: () => void;
  onRemove: (id: string) => void;
  onAllocationChange: (id: string, v: string) => void;
  showSearch: boolean;
  onSelectFund: (id: string) => void;
  nisaType: "both" | "seichoh";
}

function QuotaCard({
  title, color, annualLimit, entries, total, monthly, annualUsed,
  onMonthlyChange, onAddClick, onRemove, onAllocationChange,
  showSearch, onSelectFund, nisaType,
}: QuotaCardProps) {
  const accent      = color === "blue" ? "text-blue-400" : "text-violet-400";
  const barColor    = color === "blue" ? "bg-blue-500" : "bg-violet-500";
  const borderColor = color === "blue" ? "border-blue-500/20" : "border-violet-500/20";
  const bgColor     = color === "blue" ? "bg-blue-500/5" : "bg-violet-500/5";
  const pct         = Math.min(100, Math.round((annualUsed / annualLimit) * 100));
  const overLimit   = annualUsed > annualLimit;

  return (
    <Card className={`${borderColor} ${bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-semibold ${accent}`}>{title}</CardTitle>
          <Badge variant="outline" className={`text-xs ${accent}`}>
            年間上限 {(annualLimit / 10000).toFixed(0)}万円
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">

        {/* 月額入力 */}
        <div className="flex items-center gap-3">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">月額</Label>
          <div className="relative flex-1">
            <Input
              type="number" min={0} value={monthly}
              onChange={(e) => onMonthlyChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="pr-8 h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">円</span>
          </div>
          {Number(monthly) > 0 && (
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">年間</p>
              <p className={`text-xs font-bold ${overLimit ? "text-yellow-500" : accent}`}>
                {(annualUsed / 10000).toFixed(1)}万
              </p>
            </div>
          )}
        </div>

        {/* 年間使用率バー */}
        {Number(monthly) > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>年間枠使用率</span>
              <span className={overLimit ? "text-yellow-500 font-semibold" : ""}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${overLimit ? "bg-yellow-500" : barColor}`} style={{ width: `${pct}%` }} />
            </div>
            {overLimit && (
              <div className="flex items-center gap-1.5 text-xs text-yellow-500">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>年間上限{(annualLimit / 10000).toFixed(0)}万円を超えています</span>
              </div>
            )}
          </div>
        )}

        {/* 銘柄リスト */}
        {entries.map((entry) => {
          const fund = MOCK_FUNDS.find((f) => f.id === entry.fundId);
          if (!fund) return null;
          return (
            <div key={entry.fundId} className="flex items-center gap-2 p-2.5 rounded-xl bg-background/60">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{fund.name.replace("eMAXIS Slim ", "")}</p>
                <p className="text-xs text-muted-foreground">{fund.category}</p>
              </div>
              <Input
                type="number" min={0} max={100}
                value={entry.allocationStr}
                onChange={(e) => onAllocationChange(entry.fundId, e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-14 h-7 text-center text-xs"
              />
              <span className="text-xs text-muted-foreground">%</span>
              <button onClick={() => onRemove(entry.fundId)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {total !== 100 && entries.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>合計 {total}%（100%にしてください）</span>
          </div>
        )}

        {showSearch ? (
          <FundSearch
            onSelect={onSelectFund}
            selectedIds={entries.map((e) => e.fundId)}
            defaultNisaFilter={nisaType === "both" ? "both" : "seichoh"}
          />
        ) : (
          <button
            onClick={onAddClick}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-xs"
          >
            <Plus className="w-3.5 h-3.5" />銘柄を追加
          </button>
        )}
      </CardContent>
    </Card>
  );
}
