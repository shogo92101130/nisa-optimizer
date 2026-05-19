"use client";

import { useState, useMemo } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { NisaQuotaChart } from "./NisaQuotaChart";
import { FundSelectInline } from "./FundSelectInline";
import { calcNisaQuota, formatManEn } from "@/utils/finance/nisaQuota";
import { NISA_LIMITS } from "@/constants/nisa";

export function NisaQuotaSection() {
  const [tsumitateMonthly, setTsumitateMonthly] = useState("30000");
  const [seichohMonthly, setSeichohMonthly] = useState("30000");
  const [tsumiFundId, setTsumiFundId] = useState("eMAXIS-slim-sp500");
  const [seichohFundId, setSeichohFundId] = useState("eMAXIS-slim-nasdaq100");

  const result = useMemo(() => calcNisaQuota({
    tsumitateMonthly: Number(tsumitateMonthly) || 0,
    seichohMonthly:   Number(seichohMonthly)   || 0,
  }), [tsumitateMonthly, seichohMonthly]);

  return (
    <div className="space-y-4">

      {/* つみたて投資枠 */}
      <QuotaInputCard
        title="つみたて投資枠"
        annualLimit={NISA_LIMITS.tsumitate}
        lifetimeLimit={NISA_LIMITS.tsumitate_lifetime}
        monthly={tsumitateMonthly}
        onMonthlyChange={setTsumitateMonthly}
        fundId={tsumiFundId}
        onFundChange={setTsumiFundId}
        annualUsed={result.tsumitateAnnual}
        annualRate={result.tsumitateAnnualRate}
        fullYears={result.tsumitateFullYears}
        overLimit={result.tsumitateOverLimit}
        color="blue"
        nisaType="both"
      />

      {/* 成長投資枠 */}
      <QuotaInputCard
        title="成長投資枠"
        annualLimit={NISA_LIMITS.seichoh}
        lifetimeLimit={NISA_LIMITS.seichoh_lifetime}
        monthly={seichohMonthly}
        onMonthlyChange={setSeichohMonthly}
        fundId={seichohFundId}
        onFundChange={setSeichohFundId}
        annualUsed={result.seichohAnnual}
        annualRate={result.seichohAnnualRate}
        fullYears={result.seichohFullYears}
        overLimit={result.seichohOverLimit}
        color="violet"
        nisaType="seichoh"
      />

      {/* 合計サマリー */}
      {(Number(tsumitateMonthly) > 0 || Number(seichohMonthly) > 0) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">月額合計</span>
              <span className="text-sm font-bold">
                {formatManEn((Number(tsumitateMonthly) || 0) + (Number(seichohMonthly) || 0))} / 月
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">年間合計消化</span>
              <span className="text-sm font-bold">{formatManEn(result.totalAnnual)} / 年</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">生涯1,800万円 満額まで</span>
              <span className="text-sm font-bold text-primary">
                {result.totalFullYears ? `約${result.totalFullYears}年` : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 累計推移グラフ */}
      {result.yearlyRecords.length > 0 && (
        <NisaQuotaChart records={result.yearlyRecords} />
      )}
    </div>
  );
}

// ── 枠ごとの入力カード ───────────────────────────────────────────

interface QuotaInputCardProps {
  title: string;
  annualLimit: number;
  lifetimeLimit: number;
  monthly: string;
  onMonthlyChange: (v: string) => void;
  fundId: string;
  onFundChange: (id: string) => void;
  annualUsed: number;
  annualRate: number;
  fullYears: number | null;
  overLimit: boolean;
  color: "blue" | "violet";
  nisaType: "both" | "seichoh";
}

function QuotaInputCard({
  title, annualLimit, lifetimeLimit,
  monthly, onMonthlyChange,
  fundId, onFundChange,
  annualUsed, annualRate, fullYears,
  overLimit, color, nisaType,
}: QuotaInputCardProps) {
  const accent = color === "blue" ? "text-blue-400" : "text-violet-400";
  const barColor = color === "blue" ? "bg-blue-500" : "bg-violet-500";
  const pct = Math.min(100, Math.round(annualRate * 100));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">年間上限</span>
            <Badge variant="outline" className={`text-xs ${accent}`}>
              {formatManEn(annualLimit)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 銘柄選択 */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">銘柄</Label>
          <FundSelectInline
            value={fundId}
            onChange={onFundChange}
            nisaType={nisaType}
          />
        </div>

        {/* 月額入力 */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">月額積立</Label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              value={monthly}
              onChange={(e) => onMonthlyChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">円</span>
          </div>
        </div>

        {/* 年間消化 & プログレスバー */}
        {Number(monthly) > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">年間消化</span>
              <span className={`font-semibold ${accent}`}>
                {formatManEn(annualUsed)} / {formatManEn(annualLimit)} ({pct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* 超過警告 */}
            {overLimit && (
              <div className="flex items-center gap-1.5 text-xs text-yellow-500 bg-yellow-500/10 px-3 py-2 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>年間上限{formatManEn(annualLimit)}を超えています。超過分は課税口座での運用になります。</span>
              </div>
            )}

            {/* 生涯枠情報 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-muted/40 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-muted-foreground">生涯枠</p>
                <p className="text-sm font-bold mt-0.5">{formatManEn(lifetimeLimit)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-muted-foreground">満額まで</p>
                <p className={`text-sm font-bold mt-0.5 ${accent}`}>
                  {fullYears ? `約${fullYears}年` : "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {Number(monthly) === 0 && (
          <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 opacity-30" />
            <span>月額を入力すると枠の消化スピードが計算されます</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
