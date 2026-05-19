"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_FUNDS } from "@/mock/funds";

interface FundSearchProps {
  onSelect: (fundId: string) => void;
  selectedIds: string[];
}

export function FundSearch({ onSelect, selectedIds }: FundSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = MOCK_FUNDS.filter(
    (f) =>
      !selectedIds.includes(f.id) &&
      (query === "" || f.name.toLowerCase().includes(query.toLowerCase()) || f.category.includes(query))
  );

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

      <div className="max-h-52 overflow-y-auto space-y-1 rounded-xl border border-border bg-popover p-1">
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
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{fund.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  信託報酬 {(fund.expenseRatio * 100).toFixed(3)}%
                </p>
              </div>
              <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                {fund.category}
              </Badge>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
