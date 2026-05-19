export const NISA_LIMITS = {
  tsumitate: 120_000,   // つみたて投資枠 年間120万円
  seichoh: 2_400_000,   // 成長投資枠 年間240万円
  both: 3_600_000,      // 合計年間360万円
  lifetime: 18_000_000, // 生涯非課税枠1800万円
} as const;

export const TAX_RATE = 0.20315; // 20.315%（所得税+住民税+復興特別所得税）
