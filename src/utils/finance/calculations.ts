import { MonthlyRecord, PortfolioItem, SimulationInput, SimulationResult } from "@/types";
import { MOCK_FUNDS } from "@/mock/funds";

export type QuotaConfig = {
  fundEntries: { fundId: string; allocation: number }[]; // 配分 0-100
  monthlyAmount: number;
};

/** 2つの枠設定を合算して単一のPortfolioItem[]に変換 */
export function mergeQuotaConfigs(
  tsumitate: QuotaConfig,
  seichoh: QuotaConfig
): { portfolio: PortfolioItem[]; totalMonthly: number } {
  const totalMonthly = tsumitate.monthlyAmount + seichoh.monthlyAmount;
  if (totalMonthly === 0) return { portfolio: [], totalMonthly: 0 };

  // 各銘柄の実際の月額を計算（枠月額 × 配分%）
  const fundMap = new Map<string, number>();

  for (const e of tsumitate.fundEntries) {
    const amount = tsumitate.monthlyAmount * (e.allocation / 100);
    fundMap.set(e.fundId, (fundMap.get(e.fundId) ?? 0) + amount);
  }
  for (const e of seichoh.fundEntries) {
    const amount = seichoh.monthlyAmount * (e.allocation / 100);
    fundMap.set(e.fundId, (fundMap.get(e.fundId) ?? 0) + amount);
  }

  // 月額ベースのウェイトをパーセントに変換
  const portfolio: PortfolioItem[] = [];
  for (const [fundId, amount] of fundMap.entries()) {
    const allocation = Math.round((amount / totalMonthly) * 100);
    if (allocation > 0) portfolio.push({ fundId, allocation });
  }

  // 端数調整（合計を100%に）
  const total = portfolio.reduce((s, p) => s + p.allocation, 0);
  if (total !== 100 && portfolio.length > 0) {
    portfolio[0].allocation += 100 - total;
  }

  return { portfolio, totalMonthly };
}

/** 安全な除算（0除算対策） */
export function safeDivide(a: number, b: number): number {
  if (b === 0 || !isFinite(b) || isNaN(b)) return 0;
  const result = a / b;
  return isFinite(result) ? result : 0;
}

/** ポートフォリオの加重平均月次リターン計算 */
export function getPortfolioMonthlyReturn(
  portfolio: PortfolioItem[],
  monthIndex: number
): number {
  if (portfolio.length === 0) return 0;

  let weightedReturn = 0;
  for (const item of portfolio) {
    const fund = MOCK_FUNDS.find((f) => f.id === item.fundId);
    if (!fund || fund.monthlyReturns.length === 0) continue;
    const idx = monthIndex % fund.monthlyReturns.length;
    const r = fund.monthlyReturns[idx];
    if (isFinite(r) && !isNaN(r)) {
      weightedReturn += r * (item.allocation / 100);
    }
  }
  return weightedReturn;
}

/** CAGR（年平均成長率）計算 */
export function calcCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || finalValue <= 0 || years <= 0) return 0;
  const result = Math.pow(safeDivide(finalValue, initialValue), safeDivide(1, years)) - 1;
  return isFinite(result) ? result : 0;
}

/** ボラティリティ（年率換算）計算 */
export function calcVolatility(monthlyReturns: number[]): number {
  if (monthlyReturns.length < 2) return 0;
  const mean = monthlyReturns.reduce((s, r) => s + r, 0) / monthlyReturns.length;
  const variance = monthlyReturns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / (monthlyReturns.length - 1);
  return Math.sqrt(variance * 12); // 年率換算
}

/** シャープレシオ計算（無リスク金利0.001想定） */
export function calcSharpeRatio(annualReturn: number, volatility: number): number {
  const riskFreeRate = 0.001;
  return safeDivide(annualReturn - riskFreeRate, volatility);
}

/** 最大ドローダウン計算 */
export function calcMaxDrawdown(records: MonthlyRecord[]): number {
  if (records.length === 0) return 0;
  let peak = records[0].totalAsset;
  let maxDD = 0;
  for (const r of records) {
    if (r.totalAsset > peak) peak = r.totalAsset;
    const dd = safeDivide(peak - r.totalAsset, peak);
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

/** メインシミュレーション */
export function runSimulation(input: SimulationInput): SimulationResult {
  const { portfolio, monthlyAmount, years, initialAmount } = input;
  const totalMonths = years * 12;
  const records: MonthlyRecord[] = [];
  const monthlyReturnsHistory: number[] = [];

  let totalAsset = initialAmount;
  let principal = initialAmount;

  for (let m = 0; m < totalMonths; m++) {
    principal += monthlyAmount;
    const monthlyReturn = getPortfolioMonthlyReturn(portfolio, m);
    monthlyReturnsHistory.push(monthlyReturn);
    totalAsset = (totalAsset + monthlyAmount) * (1 + monthlyReturn);
    totalAsset = Math.max(0, totalAsset); // 0未満にならないよう保護

    records.push({
      month: m + 1,
      totalAsset,
      principal,
      profit: totalAsset - principal,
      drawdown: 0, // 後で計算
    });
  }

  // ドローダウンを後付け計算
  let peak = 0;
  for (const r of records) {
    if (r.totalAsset > peak) peak = r.totalAsset;
    r.drawdown = safeDivide(peak - r.totalAsset, peak);
  }

  const finalAsset = records.at(-1)?.totalAsset ?? 0;
  const totalPrincipal = principal;
  const totalProfit = finalAsset - totalPrincipal;
  const cagr = calcCAGR(initialAmount || monthlyAmount, finalAsset, years);
  const volatility = calcVolatility(monthlyReturnsHistory);
  const sharpeRatio = calcSharpeRatio(cagr, volatility);
  const maxDrawdown = calcMaxDrawdown(records);

  return {
    records,
    cagr,
    totalReturn: safeDivide(totalProfit, totalPrincipal),
    sharpeRatio,
    maxDrawdown,
    volatility,
    finalAsset,
    totalPrincipal,
    totalProfit,
  };
}
