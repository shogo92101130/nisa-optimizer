"use client";

import { useState, useEffect } from "react";

type Entry = { fundId: string; allocationStr: string };

type StoredState = {
  tsumiEntries: Entry[];
  tsumiMonthly: string;
  seichohEntries: Entry[];
  seichohMonthly: string;
  years: string;
};

const KEY = "nisa-optimizer-portfolio";

function defaults(): StoredState {
  return { tsumiEntries: [], tsumiMonthly: "30000", seichohEntries: [], seichohMonthly: "0", years: "20" };
}

function readStorage(): StoredState {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (raw) return { ...defaults(), ...(JSON.parse(raw) as Partial<StoredState>) };
  } catch { /* ignore */ }
  return defaults();
}

function writeStorage(s: StoredState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function usePortfolioStorage() {
  // useState initializer: SSR時はdefaults、CSR時はlocalStorageから読む
  const [state, setState] = useState<StoredState>(() =>
    typeof window !== "undefined" ? readStorage() : defaults()
  );

  // stateが変わるたびに保存
  useEffect(() => {
    writeStorage(state);
  }, [state]);

  function set<K extends keyof StoredState>(key: K, value: StoredState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  return {
    tsumiEntries:      state.tsumiEntries,
    tsumiMonthly:      state.tsumiMonthly,
    seichohEntries:    state.seichohEntries,
    seichohMonthly:    state.seichohMonthly,
    years:             state.years,
    setTsumiEntries:   (v: Entry[]) => set("tsumiEntries", v),
    setTsumiMonthly:   (v: string)  => set("tsumiMonthly", v),
    setSeichohEntries: (v: Entry[]) => set("seichohEntries", v),
    setSeichohMonthly: (v: string)  => set("seichohMonthly", v),
    setYears:          (v: string)  => set("years", v),
  };
}
