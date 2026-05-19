"use client";

import { MOCK_FUNDS } from "@/mock/funds";

interface Props {
  value: string;
  onChange: (id: string) => void;
  nisaType: "both" | "seichoh";
}

export function FundSelectInline({ value, onChange, nisaType }: Props) {
  const funds = MOCK_FUNDS.filter((f) =>
    nisaType === "both" ? f.nisaType === "both" : true
  );

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {funds.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name.replace("eMAXIS Slim ", "").replace("・インデックス・ファンド", "").replace("インデックス", "")}
        </option>
      ))}
    </select>
  );
}
