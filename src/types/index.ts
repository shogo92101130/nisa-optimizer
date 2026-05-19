export type FundCategory =
  | "国内株式"
  | "先進国株式"
  | "新興国株式"
  | "国内債券"
  | "先進国債券"
  | "不動産(REIT)"
  | "バランス";

export type NisaType = "tsumitate" | "seichoh" | "both";

export type Fund = {
  id: string;
  name: string;
  category: FundCategory;
  nisaType: NisaType;
  monthlyReturns: number[];
  expenseRatio: number;
  annualReturn?: number;
};

export type PortfolioItem = {
  fundId: string;
  allocation: number; // 0-100
};

export type NisaSettings = {
  type: "tsumitate" | "seichoh" | "both";
  annualLimit: number;
};

export type SimulationInput = {
  portfolio: PortfolioItem[];
  monthlyAmount: number;
  years: number;
  nisa: NisaSettings;
  initialAmount: number;
};

export type MonthlyRecord = {
  month: number;
  totalAsset: number;
  principal: number;
  profit: number;
  drawdown: number;
};

export type SimulationResult = {
  records: MonthlyRecord[];
  cagr: number;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  finalAsset: number;
  totalPrincipal: number;
  totalProfit: number;
};
