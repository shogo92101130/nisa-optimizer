import type { SimulationResult } from "@/types";

export type RiskLevel = "high" | "medium" | "low";
export type ReturnLevel = "high" | "medium" | "low";

export type SimulationAdvice = {
  riskLevel: RiskLevel;
  returnLevel: ReturnLevel;
  headline: string;   // 一言見出し
  detail: string;     // 補足説明
  emoji: string;
};

export function analyzeSimulation(result: SimulationResult): SimulationAdvice {
  const { cagr, sharpeRatio, maxDrawdown, volatility } = result;

  const riskLevel: RiskLevel =
    maxDrawdown > 0.35 || volatility > 0.2 ? "high" :
    maxDrawdown > 0.2  || volatility > 0.12 ? "medium" : "low";

  const returnLevel: ReturnLevel =
    cagr > 0.12 ? "high" :
    cagr > 0.06 ? "medium" : "low";

  // リスク × リターンの組み合わせで一言を決定
  if (riskLevel === "high" && returnLevel === "high") {
    return {
      riskLevel, returnLevel, emoji: "🚀",
      headline: "ハイリスク・ハイリターン型",
      detail: `年率${pct(cagr)}の高リターンが期待できますが、最大${pct(maxDrawdown)}の下落リスクがあります。短期的な資産減に耐えられる方向けです。`,
    };
  }
  if (riskLevel === "high" && returnLevel === "medium") {
    return {
      riskLevel, returnLevel, emoji: "⚡",
      headline: "リスクが高め・リターンは普通",
      detail: `値動きが大きい割にリターンが${pct(cagr)}と控えめです。シャープレシオ${sharpeRatio.toFixed(2)}は改善の余地があります。分散を強化しましょう。`,
    };
  }
  if (riskLevel === "high" && returnLevel === "low") {
    return {
      riskLevel, returnLevel, emoji: "⚠️",
      headline: "リスクの割にリターンが低い",
      detail: `最大${pct(maxDrawdown)}の下落リスクに対してリターンが${pct(cagr)}と低めです。銘柄の見直しを検討してください。`,
    };
  }
  if (riskLevel === "medium" && returnLevel === "high") {
    return {
      riskLevel, returnLevel, emoji: "✨",
      headline: "バランス良く高リターン",
      detail: `シャープレシオ${sharpeRatio.toFixed(2)}で効率よく年率${pct(cagr)}のリターンが期待できます。長期積立に優れた構成です。`,
    };
  }
  if (riskLevel === "medium" && returnLevel === "medium") {
    return {
      riskLevel, returnLevel, emoji: "👍",
      headline: "バランス型・堅実な構成",
      detail: `年率${pct(cagr)}のリターンを適度なリスクで狙えます。長期積立に安心して使える構成です。`,
    };
  }
  if (riskLevel === "medium" && returnLevel === "low") {
    return {
      riskLevel, returnLevel, emoji: "🔍",
      headline: "安定重視だがリターンは控えめ",
      detail: `リスクは抑えられていますが、年率${pct(cagr)}と増え方はゆっくりです。インフレ負けしないよう株式比率を少し上げると良いかもしれません。`,
    };
  }
  if (riskLevel === "low" && returnLevel === "high") {
    return {
      riskLevel, returnLevel, emoji: "🏆",
      headline: "低リスクで高リターン！理想的",
      detail: `シャープレシオ${sharpeRatio.toFixed(2)}と非常に効率的です。年率${pct(cagr)}を低ボラティリティで実現しています。`,
    };
  }
  if (riskLevel === "low" && returnLevel === "medium") {
    return {
      riskLevel, returnLevel, emoji: "🛡️",
      headline: "低リスク・安定型",
      detail: `値動きが少なく、年率${pct(cagr)}をコツコツ積み上げる構成です。老後資金や守りの積立に向いています。`,
    };
  }
  // low risk, low return
  return {
    riskLevel, returnLevel, emoji: "💤",
    headline: "超安定型・ゆっくり増える",
    detail: `リスクは最小限ですが、年率${pct(cagr)}の伸びはインフレに負ける可能性があります。少し株式比率を上げることを検討してみましょう。`,
  };
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
