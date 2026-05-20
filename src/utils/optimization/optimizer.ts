import { runSimulation } from "@/utils/finance/calculations";
import type { PortfolioItem, SimulationResult } from "@/types";
import { NISA_LIMITS } from "@/constants/nisa";

export type OptimizeGoal = "sharpe" | "return" | "drawdown";

export type OptimizeResult = {
  portfolio: PortfolioItem[];
  result: SimulationResult;
  score: number;
  rank: number;
};

/**
 * 総当たりで最適配分を探索（10%刻み、最大3銘柄まで実用的な速度で）
 */
export function optimizePortfolio(
  fundIds: string[],
  monthlyAmount: number,
  years: number,
  goal: OptimizeGoal,
  topN = 5
): OptimizeResult[] {
  if (fundIds.length === 0 || monthlyAmount <= 0) return [];

  const step = 10;
  const candidates: OptimizeResult[] = [];
  const nisa = { type: "both" as const, annualLimit: NISA_LIMITS.total_annual };

  // 銘柄が1つのとき
  if (fundIds.length === 1) {
    const portfolio = [{ fundId: fundIds[0], allocation: 100 }];
    const result = runSimulation({ portfolio, monthlyAmount, years, nisa, initialAmount: 0 });
    candidates.push({ portfolio, result, score: score(result, goal), rank: 1 });
    return candidates;
  }

  // 2銘柄: 10%刻みで全組み合わせ
  if (fundIds.length === 2) {
    for (let a = step; a <= 100 - step; a += step) {
      const portfolio: PortfolioItem[] = [
        { fundId: fundIds[0], allocation: a },
        { fundId: fundIds[1], allocation: 100 - a },
      ];
      const result = runSimulation({ portfolio, monthlyAmount, years, nisa, initialAmount: 0 });
      candidates.push({ portfolio, result, score: score(result, goal), rank: 0 });
    }
  }

  // 3銘柄: 10%刻みで全組み合わせ（合計100%のみ）
  if (fundIds.length === 3) {
    for (let a = step; a <= 100 - step * 2; a += step) {
      for (let b = step; b <= 100 - a - step; b += step) {
        const c = 100 - a - b;
        if (c < step) continue;
        const portfolio: PortfolioItem[] = [
          { fundId: fundIds[0], allocation: a },
          { fundId: fundIds[1], allocation: b },
          { fundId: fundIds[2], allocation: c },
        ];
        const result = runSimulation({ portfolio, monthlyAmount, years, nisa, initialAmount: 0 });
        candidates.push({ portfolio, result, score: score(result, goal), rank: 0 });
      }
    }
  }

  // 4銘柄以上: 均等配分＋主要パターンのみ
  if (fundIds.length >= 4) {
    const patterns = generatePatterns(fundIds.length, step);
    for (const allocs of patterns) {
      const portfolio = fundIds.map((id, i) => ({ fundId: id, allocation: allocs[i] }));
      const result = runSimulation({ portfolio, monthlyAmount, years, nisa, initialAmount: 0 });
      candidates.push({ portfolio, result, score: score(result, goal), rank: 0 });
    }
  }

  // スコア降順でソートしてtopN件を返す
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, topN).map((c, i) => ({ ...c, rank: i + 1 }));
}

function score(result: SimulationResult, goal: OptimizeGoal): number {
  switch (goal) {
    case "sharpe":   return result.sharpeRatio;
    case "return":   return result.cagr;
    case "drawdown": return -result.maxDrawdown; // 小さいほど良い
  }
}

/** 4銘柄以上向けのパターン生成（10%刻み、主要配分のみ） */
function generatePatterns(n: number, step: number): number[][] {
  const equal = Math.floor(100 / n);
  const patterns: number[][] = [];

  // 均等配分
  const eqAlloc = Array(n).fill(equal);
  eqAlloc[0] += 100 - equal * n; // 端数補正
  patterns.push(eqAlloc);

  // 1銘柄ずつ重点配分（50%、残りは均等）
  for (let focus = 0; focus < n; focus++) {
    const alloc = Array(n).fill(step);
    const rest = 100 - 50 - step * (n - 1);
    alloc[focus] = 50 + (rest >= 0 ? rest : 0);
    if (alloc.reduce((s, v) => s + v, 0) === 100) patterns.push([...alloc]);
  }

  return patterns;
}
