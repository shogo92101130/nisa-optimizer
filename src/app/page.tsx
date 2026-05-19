"use client";

import { useState } from "react";
import { BarChart3, PieChart, TrendingUp, Settings } from "lucide-react";
import { PortfolioForm } from "@/components/portfolio/PortfolioForm";
import { SimulationTab } from "@/components/simulation/SimulationTab";
import { ChartsTab } from "@/components/charts/ChartsTab";
import type { SimulationResult } from "@/types";

type Tab = "portfolio" | "simulation" | "charts" | "settings";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "portfolio",   label: "ポートフォリオ", icon: PieChart },
  { id: "simulation",  label: "シミュレーション", icon: TrendingUp },
  { id: "charts",      label: "グラフ",       icon: BarChart3 },
  { id: "settings",    label: "設定",         icon: Settings },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [years, setYears] = useState(20);
  const [allocationEntries, setAllocationEntries] = useState<{ fundId: string; allocation: number }[]>([]);

  function handleSimulationComplete(
    res: SimulationResult,
    y: number,
    entries: { fundId: string; allocation: number }[]
  ) {
    setResult(res);
    setYears(y);
    setAllocationEntries(entries);
    // 実行後は自動でシミュレーションタブに切り替え
    setActiveTab("simulation");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm tracking-tight">NISA Optimizer</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {activeTab === "portfolio" && (
          <PortfolioForm onSimulationComplete={handleSimulationComplete} />
        )}
        {activeTab === "simulation" && (
          <SimulationTab result={result} years={years} onGoToPortfolio={() => setActiveTab("portfolio")} />
        )}
        {activeTab === "charts" && (
          <ChartsTab result={result} allocationEntries={allocationEntries} onGoToPortfolio={() => setActiveTab("portfolio")} />
        )}
        {activeTab === "settings" && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Settings className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">設定は準備中です</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 flex">
          {TABS.map(({ id, label, icon: Icon }) => {
            const hasResult = result !== null;
            const isDisabled = (id === "simulation" || id === "charts") && !hasResult;
            return (
              <button
                key={id}
                onClick={() => !isDisabled && setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative ${
                  activeTab === id
                    ? "text-primary"
                    : isDisabled
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {/* 結果ありのバッジ */}
                {(id === "simulation" || id === "charts") && hasResult && activeTab !== id && (
                  <span className="absolute top-2 right-[calc(50%-16px)] w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
