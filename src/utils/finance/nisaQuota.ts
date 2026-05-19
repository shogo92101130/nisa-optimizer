import { NISA_LIMITS } from "@/constants/nisa";

export type NisaQuotaInput = {
  tsumitateMonthly: number;  // つみたて枠の月額
  seichohMonthly: number;    // 成長枠の月額
};

export type YearlyRecord = {
  year: number;
  tsumitateUsed: number;      // つみたて枠 累計使用額
  seichohUsed: number;        // 成長枠 累計使用額
  totalUsed: number;          // 合計累計
  tsumitateRemaining: number; // つみたて枠 残り生涯枠
  seichohRemaining: number;   // 成長枠 残り生涯枠
  tsumitateAnnual: number;    // その年のつみたて枠消化額
  seichohAnnual: number;      // その年の成長枠消化額
};

export type NisaQuotaResult = {
  tsumitateAnnual: number;         // 年間つみたて消化額
  seichohAnnual: number;           // 年間成長消化額
  totalAnnual: number;             // 年間合計消化額
  tsumitateFullYears: number | null;  // つみたて生涯満額まで何年（nullは枠内）
  seichohFullYears: number | null;    // 成長生涯満額まで何年
  totalFullYears: number | null;      // 生涯合計満額まで何年
  tsumitateAnnualRate: number;     // 年間つみたて枠使用率（0-1）
  seichohAnnualRate: number;       // 年間成長枠使用率（0-1）
  yearlyRecords: YearlyRecord[];   // 50年分の年次推移
  tsumitateOverLimit: boolean;     // 年間上限超過
  seichohOverLimit: boolean;       // 年間上限超過
};

export function calcNisaQuota(input: NisaQuotaInput): NisaQuotaResult {
  const { tsumitateMonthly, seichohMonthly } = input;

  // 年間消化額（月額×12、上限でクランプ）
  const tsumitateAnnual = Math.min(tsumitateMonthly * 12, NISA_LIMITS.tsumitate);
  const seichohAnnual   = Math.min(seichohMonthly   * 12, NISA_LIMITS.seichoh);
  const totalAnnual     = tsumitateAnnual + seichohAnnual;

  const tsumitateOverLimit = tsumitateMonthly * 12 > NISA_LIMITS.tsumitate;
  const seichohOverLimit   = seichohMonthly   * 12 > NISA_LIMITS.seichoh;

  // 生涯満額まで何年
  const tsumitateFullYears = tsumitateAnnual > 0
    ? Math.ceil(NISA_LIMITS.tsumitate_lifetime / tsumitateAnnual)
    : null;
  const seichohFullYears = seichohAnnual > 0
    ? Math.ceil(NISA_LIMITS.seichoh_lifetime / seichohAnnual)
    : null;
  const totalFullYears = totalAnnual > 0
    ? Math.ceil(NISA_LIMITS.lifetime / totalAnnual)
    : null;

  // 50年分の年次累計レコード
  const yearlyRecords: YearlyRecord[] = [];
  let tsumitateUsed = 0;
  let seichohUsed   = 0;

  for (let year = 1; year <= 50; year++) {
    const tAdd = Math.min(tsumitateAnnual, Math.max(0, NISA_LIMITS.tsumitate_lifetime - tsumitateUsed));
    const sAdd = Math.min(seichohAnnual,   Math.max(0, NISA_LIMITS.seichoh_lifetime   - seichohUsed));
    tsumitateUsed += tAdd;
    seichohUsed   += sAdd;

    yearlyRecords.push({
      year,
      tsumitateUsed,
      seichohUsed,
      totalUsed: tsumitateUsed + seichohUsed,
      tsumitateRemaining: NISA_LIMITS.tsumitate_lifetime - tsumitateUsed,
      seichohRemaining:   NISA_LIMITS.seichoh_lifetime   - seichohUsed,
      tsumitateAnnual: tAdd,
      seichohAnnual: sAdd,
    });

    // 両方満額になったら終了
    if (tsumitateUsed >= NISA_LIMITS.tsumitate_lifetime && seichohUsed >= NISA_LIMITS.seichoh_lifetime) break;
  }

  return {
    tsumitateAnnual,
    seichohAnnual,
    totalAnnual,
    tsumitateFullYears,
    seichohFullYears,
    totalFullYears,
    tsumitateAnnualRate: tsumitateAnnual / NISA_LIMITS.tsumitate,
    seichohAnnualRate:   seichohAnnual   / NISA_LIMITS.seichoh,
    yearlyRecords,
    tsumitateOverLimit,
    seichohOverLimit,
  };
}

export function formatManEn(n: number): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(0)}千万円`;
  if (n >= 1_000_000)  return `${(n / 10_000).toFixed(0)}万円`;
  return `${(n / 10_000).toFixed(1)}万円`;
}
