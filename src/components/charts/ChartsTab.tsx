"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetChart } from "./AssetChart";
import { AllocationPieChart } from "./AllocationPieChart";
import { AnnualReturnChart } from "./AnnualReturnChart";
import { DrawdownChart } from "./DrawdownChart";
import type { SimulationResult } from "@/types";

interface Props {
  result: SimulationResult | null;
  allocationEntries: { fundId: string; allocation: number }[];
  onGoToPortfolio: () => void;
}

export function ChartsTab({ result, allocationEntries, onGoToPortfolio }: Props) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-4">
        <BarChart3 className="w-12 h-12 opacity-20" />
        <div className="text-center">
          <p className="text-sm font-medium">シミュレーションを実行するとグラフが表示されます</p>
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
      {/* 配分円グラフ */}
      {allocationEntries.length >= 2 && (
        <AllocationPieChart entries={allocationEntries} />
      )}

      {/* 資産推移 */}
      <AssetChart records={result.records} />

      {/* 年次リターン */}
      <AnnualReturnChart records={result.records} />

      {/* ドローダウン */}
      <DrawdownChart records={result.records} />
    </div>
  );
}
