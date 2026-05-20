"use client";

import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimulationResultCard } from "./SimulationResultCard";
import { OptimizerSection } from "./OptimizerSection";
import type { SimulationResult } from "@/types";

interface Props {
  result: SimulationResult | null;
  years: number;
  monthlyAmount: number;
  allocationEntries: { fundId: string; allocation: number }[];
  onGoToPortfolio: () => void;
}

export function SimulationTab({ result, years, monthlyAmount, allocationEntries, onGoToPortfolio }: Props) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-4">
        <TrendingUp className="w-12 h-12 opacity-20" />
        <div className="text-center">
          <p className="text-sm font-medium">まだシミュレーションが実行されていません</p>
          <p className="text-xs mt-1 opacity-60">ポートフォリオを作成して実行してください</p>
        </div>
        <Button variant="outline" size="sm" onClick={onGoToPortfolio}>
          ポートフォリオを作成する
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SimulationResultCard result={result} years={years} />
      <OptimizerSection
        fundIds={allocationEntries.map((e) => e.fundId)}
        monthlyAmount={monthlyAmount}
        years={years}
      />
    </div>
  );
}
