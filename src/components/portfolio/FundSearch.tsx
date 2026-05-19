"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_FUNDS } from "@/mock/funds";
import type { NisaType } from "@/types";

const NISA_LABEL: Record<NisaType, string> = {
  both: "つみたて・成長",
  tsumitate: "つみたて枠",
  seichoh: "成長投資枠",
};

const NISA_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "both", label: "つみたて可" },
  { value: "seichoh", label: "成長投資枠" },
] as const;

interface FundSearchProps {
  onSelect: (fundId: string) => void;
  selectedIds: string[];
}

export function FundSearch({ onSelect, selectedIds }: FundSearchProps) {
  const [query, setQuery] = useState("");
  const [nisaFilter, setNisaFilter] = useState<"all" | "both" | "seichoh">("all");

  const filtered = MOCK_FUNDS.filter((f) => {
    if (selectedIds.includes(f.id)) return false;
    if (nisaFilter === "both" && f.nisaType !== "both") return false;
    if (nisaFilter === "seichoh" && f.nisaType !== "seichoh" && f.nisaType !== "both") return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.category.includes(q);
  });

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="銘柄名・カテゴリで検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 text-sm h-9"
          autoFocus
        />
      </div>

      {/* NISAフィルター */}
      <div className="flex gap-1.5">
        {NISA_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setNisaFilter(f.value)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              nisaFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="max-h-60 overflow-y-auto space-y-0.5 rounded-xl border border-border bg-popover p-1">
        {filtered.length === 0 ? (
          <div className="py-4 text-center text-xs text-muted-foreground">
            該当する銘柄が見つかりません
          </div>
        ) : (
          filtered.map((fund) => (
            <button
              key={fund.id}
              onClick={() => onSelect(fund.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent text-left transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate">{fund.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  信託報酬 {fund.expenseRatio.toFixed(3)}%
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                <Badge variant="secondary" className="text-xs py-0">
                  {fund.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {NISA_LABEL[fund.nisaType]}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
      <p className="text-xs text-muted-foreground text-right">{filtered.length}件</p>
    </div>
  );
}
