import { Fund } from "@/types";

// 月次リターン（過去5年 = 60ヶ月）のモックデータ生成
function generateMonthlyReturns(
  annualReturn: number,
  volatility: number
): number[] {
  const monthlyReturn = annualReturn / 12;
  const monthlyVol = volatility / Math.sqrt(12);
  return Array.from({ length: 60 }, () => {
    const noise = (Math.random() - 0.5) * 2 * monthlyVol;
    return monthlyReturn + noise;
  });
}

export const MOCK_FUNDS: Fund[] = [
  {
    id: "eMAXIS-slim-zenkoku",
    name: "eMAXIS Slim 全世界株式（オール・カントリー）",
    category: "先進国株式",
    monthlyReturns: generateMonthlyReturns(0.12, 0.18),
    expenseRatio: 0.00577,
    annualReturn: 0.12,
  },
  {
    id: "eMAXIS-slim-sp500",
    name: "eMAXIS Slim 米国株式（S&P500）",
    category: "先進国株式",
    monthlyReturns: generateMonthlyReturns(0.14, 0.2),
    expenseRatio: 0.0074,
    annualReturn: 0.14,
  },
  {
    id: "eMAXIS-slim-domestic",
    name: "eMAXIS Slim 国内株式（TOPIX）",
    category: "国内株式",
    monthlyReturns: generateMonthlyReturns(0.08, 0.2),
    expenseRatio: 0.00143,
    annualReturn: 0.08,
  },
  {
    id: "eMAXIS-slim-developed",
    name: "eMAXIS Slim 先進国株式インデックス",
    category: "先進国株式",
    monthlyReturns: generateMonthlyReturns(0.11, 0.17),
    expenseRatio: 0.00957,
    annualReturn: 0.11,
  },
  {
    id: "eMAXIS-slim-emerging",
    name: "eMAXIS Slim 新興国株式インデックス",
    category: "新興国株式",
    monthlyReturns: generateMonthlyReturns(0.09, 0.25),
    expenseRatio: 0.01518,
    annualReturn: 0.09,
  },
  {
    id: "eMAXIS-slim-bond",
    name: "eMAXIS Slim 先進国債券インデックス",
    category: "先進国債券",
    monthlyReturns: generateMonthlyReturns(0.03, 0.07),
    expenseRatio: 0.00957,
    annualReturn: 0.03,
  },
  {
    id: "eMAXIS-slim-balance8",
    name: "eMAXIS Slim バランス（8資産均等型）",
    category: "バランス",
    monthlyReturns: generateMonthlyReturns(0.07, 0.12),
    expenseRatio: 0.0143,
    annualReturn: 0.07,
  },
  {
    id: "rakuten-vti",
    name: "楽天・全米株式インデックス・ファンド",
    category: "先進国株式",
    monthlyReturns: generateMonthlyReturns(0.13, 0.19),
    expenseRatio: 0.162,
    annualReturn: 0.13,
  },
  {
    id: "sbi-sbv500",
    name: "SBI・V・S&P500インデックス・ファンド",
    category: "先進国株式",
    monthlyReturns: generateMonthlyReturns(0.14, 0.2),
    expenseRatio: 0.0638,
    annualReturn: 0.14,
  },
  {
    id: "domestic-reit",
    name: "eMAXIS Slim 国内リートインデックス",
    category: "不動産(REIT)",
    monthlyReturns: generateMonthlyReturns(0.05, 0.22),
    expenseRatio: 0.187,
    annualReturn: 0.05,
  },
];
