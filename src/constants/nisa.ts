export const NISA_LIMITS = {
  tsumitate: 1_200_000,   // つみたて投資枠 年間上限120万円
  seichoh: 2_400_000,     // 成長投資枠 年間上限240万円
  total_annual: 3_600_000, // 合計年間360万円
  tsumitate_lifetime: 12_000_000, // つみたて生涯1,200万円
  seichoh_lifetime: 12_000_000,   // 成長生涯1,200万円
  lifetime: 18_000_000,           // 生涯合計1,800万円
} as const;

export const TAX_RATE = 0.20315;
