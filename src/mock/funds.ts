import { Fund } from "@/types";

function genReturns(annual: number, vol: number, seed: number): number[] {
  const monthly = annual / 12;
  const monthlyVol = vol / Math.sqrt(12);
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  return Array.from({ length: 120 }, () => monthly + (rand() - 0.5) * 2 * monthlyVol);
}

export const MOCK_FUNDS: Fund[] = [
  // ── つみたて投資枠・成長投資枠 共通 ──────────────────────────────

  // 全世界株式
  {
    id: "eMAXIS-slim-all-country",
    name: "eMAXIS Slim 全世界株式（オール・カントリー）",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.12, 0.17, 1),
    expenseRatio: 0.05775,
    annualReturn: 0.12,
  },
  {
    id: "rakuten-all-world",
    name: "楽天・全世界株式インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.12, 0.17, 2),
    expenseRatio: 0.162,
    annualReturn: 0.12,
  },
  {
    id: "sbi-all-country",
    name: "SBI・全世界株式インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.12, 0.17, 3),
    expenseRatio: 0.1022,
    annualReturn: 0.12,
  },

  // 米国株式（S&P500）
  {
    id: "eMAXIS-slim-sp500",
    name: "eMAXIS Slim 米国株式（S&P500）",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.14, 0.19, 4),
    expenseRatio: 0.09372,
    annualReturn: 0.14,
  },
  {
    id: "rakuten-sp500",
    name: "楽天・S&P500インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.14, 0.19, 5),
    expenseRatio: 0.077,
    annualReturn: 0.14,
  },
  {
    id: "sbi-v-sp500",
    name: "SBI・V・S&P500インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.14, 0.19, 6),
    expenseRatio: 0.0638,
    annualReturn: 0.14,
  },
  {
    id: "fidelity-sp500",
    name: "フィデリティ・インデックス・ファンド（米国株式）",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.14, 0.19, 7),
    expenseRatio: 0.094,
    annualReturn: 0.14,
  },

  // 全米株式
  {
    id: "rakuten-vti",
    name: "楽天・全米株式インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.135, 0.19, 8),
    expenseRatio: 0.162,
    annualReturn: 0.135,
  },
  {
    id: "sbi-v-total-us",
    name: "SBI・V・全米株式インデックス・ファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.135, 0.19, 9),
    expenseRatio: 0.0638,
    annualReturn: 0.135,
  },

  // 先進国株式
  {
    id: "eMAXIS-slim-developed",
    name: "eMAXIS Slim 先進国株式インデックス",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.11, 0.17, 10),
    expenseRatio: 0.09889,
    annualReturn: 0.11,
  },
  {
    id: "nissei-foreign",
    name: "ニッセイ外国株式インデックスファンド",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.11, 0.17, 11),
    expenseRatio: 0.09889,
    annualReturn: 0.11,
  },
  {
    id: "tawara-developed",
    name: "たわらノーロード 先進国株式",
    category: "先進国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.11, 0.17, 12),
    expenseRatio: 0.09889,
    annualReturn: 0.11,
  },

  // 国内株式
  {
    id: "eMAXIS-slim-topix",
    name: "eMAXIS Slim 国内株式（TOPIX）",
    category: "国内株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.08, 0.20, 13),
    expenseRatio: 0.143,
    annualReturn: 0.08,
  },
  {
    id: "eMAXIS-slim-nikkei225",
    name: "eMAXIS Slim 国内株式（日経平均）",
    category: "国内株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.08, 0.20, 14),
    expenseRatio: 0.143,
    annualReturn: 0.08,
  },
  {
    id: "nissei-topix",
    name: "ニッセイTOPIXインデックスファンド",
    category: "国内株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.08, 0.20, 15),
    expenseRatio: 0.143,
    annualReturn: 0.08,
  },
  {
    id: "tawara-nikkei225",
    name: "たわらノーロード 日経225",
    category: "国内株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.08, 0.20, 16),
    expenseRatio: 0.143,
    annualReturn: 0.08,
  },

  // 新興国株式
  {
    id: "eMAXIS-slim-emerging",
    name: "eMAXIS Slim 新興国株式インデックス",
    category: "新興国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.09, 0.25, 17),
    expenseRatio: 0.1518,
    annualReturn: 0.09,
  },
  {
    id: "tawara-emerging",
    name: "たわらノーロード 新興国株式",
    category: "新興国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.09, 0.25, 18),
    expenseRatio: 0.1859,
    annualReturn: 0.09,
  },
  {
    id: "sbi-emerging",
    name: "SBI・新興国株式インデックス・ファンド",
    category: "新興国株式",
    nisaType: "both",
    monthlyReturns: genReturns(0.09, 0.25, 19),
    expenseRatio: 0.1102,
    annualReturn: 0.09,
  },

  // 先進国債券
  {
    id: "eMAXIS-slim-bond-developed",
    name: "eMAXIS Slim 先進国債券インデックス",
    category: "先進国債券",
    nisaType: "both",
    monthlyReturns: genReturns(0.03, 0.07, 20),
    expenseRatio: 0.09889,
    annualReturn: 0.03,
  },
  {
    id: "nissei-bond",
    name: "ニッセイ外国債券インデックスファンド",
    category: "先進国債券",
    nisaType: "both",
    monthlyReturns: genReturns(0.03, 0.07, 21),
    expenseRatio: 0.09889,
    annualReturn: 0.03,
  },

  // 国内債券
  {
    id: "eMAXIS-slim-bond-domestic",
    name: "eMAXIS Slim 国内債券インデックス",
    category: "国内債券",
    nisaType: "both",
    monthlyReturns: genReturns(0.005, 0.03, 22),
    expenseRatio: 0.132,
    annualReturn: 0.005,
  },

  // バランス型
  {
    id: "eMAXIS-slim-balance8",
    name: "eMAXIS Slim バランス（8資産均等型）",
    category: "バランス",
    nisaType: "both",
    monthlyReturns: genReturns(0.07, 0.12, 23),
    expenseRatio: 0.143,
    annualReturn: 0.07,
  },
  {
    id: "world-3-moderate",
    name: "世界経済インデックスファンド",
    category: "バランス",
    nisaType: "both",
    monthlyReturns: genReturns(0.07, 0.11, 24),
    expenseRatio: 0.55,
    annualReturn: 0.07,
  },

  // ── 成長投資枠のみ ────────────────────────────────────────────

  // NASDAQ100
  {
    id: "eMAXIS-slim-nasdaq100",
    name: "eMAXIS Slim 米国株式（NASDAQ100）",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.18, 0.28, 40),
    expenseRatio: 0.2035,
    annualReturn: 0.18,
  },
  {
    id: "rakuten-nasdaq100",
    name: "楽天・NASDAQ-100インデックス・ファンド",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.17, 0.28, 25),
    expenseRatio: 0.198,
    annualReturn: 0.17,
  },
  {
    id: "ifree-nasdaq100",
    name: "iFreeNEXT NASDAQ100インデックス",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.17, 0.28, 26),
    expenseRatio: 0.495,
    annualReturn: 0.17,
  },
  // FANG+
  {
    id: "ifree-fangplus",
    name: "iFreeNEXT FANG+インデックス",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.22, 0.38, 28),
    expenseRatio: 0.7755,
    annualReturn: 0.22,
  },

  // インド株式
  {
    id: "sbi-india",
    name: "SBI・iシェアーズ・インド株式インデックス・ファンド",
    category: "新興国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.13, 0.26, 29),
    expenseRatio: 0.4638,
    annualReturn: 0.13,
  },
  {
    id: "eMAXIS-india",
    name: "eMAXIS インド株式インデックス",
    category: "新興国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.13, 0.26, 30),
    expenseRatio: 0.44,
    annualReturn: 0.13,
  },

  // 高配当株式
  {
    id: "sbi-v-dividend",
    name: "SBI・V・米国高配当株式インデックス・ファンド",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.10, 0.17, 31),
    expenseRatio: 0.1238,
    annualReturn: 0.10,
  },
  {
    id: "nf-dividend",
    name: "日本株高配当70連動型上場投信（ETF）",
    category: "国内株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.07, 0.19, 32),
    expenseRatio: 0.385,
    annualReturn: 0.07,
  },

  // 国内REIT
  {
    id: "eMAXIS-slim-reit-domestic",
    name: "eMAXIS Slim 国内リートインデックス",
    category: "不動産(REIT)",
    nisaType: "both",
    monthlyReturns: genReturns(0.05, 0.22, 33),
    expenseRatio: 0.187,
    annualReturn: 0.05,
  },
  {
    id: "eMAXIS-slim-reit-global",
    name: "eMAXIS Slim 先進国リートインデックス",
    category: "不動産(REIT)",
    nisaType: "both",
    monthlyReturns: genReturns(0.06, 0.22, 34),
    expenseRatio: 0.187,
    annualReturn: 0.06,
  },

  // アクティブ型（成長枠）
  {
    id: "ab-concentrated",
    name: "アライアンス・バーンスタイン・米国成長株投信Dコース",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.16, 0.30, 35),
    expenseRatio: 1.727,
    annualReturn: 0.16,
  },
  {
    id: "invesco-global",
    name: "インベスコ 世界厳選株式オープン（為替ヘッジなし）",
    category: "先進国株式",
    nisaType: "seichoh",
    monthlyReturns: genReturns(0.13, 0.22, 36),
    expenseRatio: 1.903,
    annualReturn: 0.13,
  },
];
