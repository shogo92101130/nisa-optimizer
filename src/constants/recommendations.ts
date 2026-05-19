export type RecommendProfile = {
  id: string;
  label: string;       // 表示名
  tag: string;         // タグ（年代など）
  description: string; // 説明
  emoji: string;
  allocations: { fundId: string; allocation: number }[];
};

export const RECOMMEND_PROFILES: RecommendProfile[] = [
  {
    id: "aggressive-20s",
    label: "積極成長（20代）",
    tag: "20代",
    emoji: "🚀",
    description: "リスクを取って最大限成長を狙う。時間が武器なので多少の下落も回復できる。",
    allocations: [
      { fundId: "eMAXIS-slim-sp500",       allocation: 50 },
      { fundId: "eMAXIS-slim-all-country", allocation: 30 },
      { fundId: "eMAXIS-slim-nasdaq100",   allocation: 20 },
    ],
  },
  {
    id: "growth-30s",
    label: "成長重視（30代）",
    tag: "30代",
    emoji: "📈",
    description: "まだ時間があるので成長株中心。国内株を少し混ぜて分散を意識。",
    allocations: [
      { fundId: "eMAXIS-slim-sp500",       allocation: 50 },
      { fundId: "eMAXIS-slim-all-country", allocation: 30 },
      { fundId: "eMAXIS-slim-topix",       allocation: 20 },
    ],
  },
  {
    id: "balance-40s",
    label: "バランス型（40代）",
    tag: "40代",
    emoji: "⚖️",
    description: "株式と債券を組み合わせリスクを抑えながらリターンを狙う。守りと攻めのバランス。",
    allocations: [
      { fundId: "eMAXIS-slim-all-country",     allocation: 40 },
      { fundId: "eMAXIS-slim-sp500",           allocation: 20 },
      { fundId: "eMAXIS-slim-bond-developed",  allocation: 25 },
      { fundId: "eMAXIS-slim-topix",           allocation: 15 },
    ],
  },
  {
    id: "stable-50s",
    label: "安定重視（50代）",
    tag: "50代",
    emoji: "🛡️",
    description: "老後まで残り年数が少ない。債券多めで資産を守りながら穏やかに増やす。",
    allocations: [
      { fundId: "eMAXIS-slim-balance8",        allocation: 40 },
      { fundId: "eMAXIS-slim-bond-developed",  allocation: 35 },
      { fundId: "eMAXIS-slim-bond-domestic",   allocation: 25 },
    ],
  },
  {
    id: "max-return",
    label: "最大リターン狙い",
    tag: "ハイリスク",
    emoji: "💥",
    description: "NASDAQ100・FANG+中心の超積極型。大きな下落リスクを覚悟のうえで最高のリターンを追求。",
    allocations: [
      { fundId: "eMAXIS-slim-nasdaq100", allocation: 40 },
      { fundId: "ifree-fangplus",        allocation: 30 },
      { fundId: "eMAXIS-slim-sp500",     allocation: 30 },
    ],
  },
  {
    id: "all-country-simple",
    label: "ほったらかし最強",
    tag: "シンプル",
    emoji: "✨",
    description: "オルカン1本。世界経済まるごと持つだけ。手間ゼロで長期的に安定成長。",
    allocations: [
      { fundId: "eMAXIS-slim-all-country", allocation: 100 },
    ],
  },
  {
    id: "india-growth",
    label: "新興国成長狙い",
    tag: "成長枠向け",
    emoji: "🌏",
    description: "インド・新興国を組み込んで先進国以上のリターンを狙う。ボラティリティは高め。",
    allocations: [
      { fundId: "eMAXIS-slim-all-country", allocation: 40 },
      { fundId: "eMAXIS-slim-sp500",       allocation: 30 },
      { fundId: "sbi-india",               allocation: 20 },
      { fundId: "eMAXIS-slim-emerging",    allocation: 10 },
    ],
  },
];
