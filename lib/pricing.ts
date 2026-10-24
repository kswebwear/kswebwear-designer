export const MIN_SHIRTS = 2;

// Mirrors the price table on www.kswebwear.com.au: [one side, front + back]
const RATES = [
  { min: 2, max: 2, oneSide: 28, bothSides: 35 },
  { min: 3, max: 9, oneSide: 26, bothSides: 32 },
] as const;

export type Estimate =
  | { kind: "minimum" }
  | { kind: "ask"; qty: number }
  | { kind: "priced"; qty: number; rate: number; total: number; bothSides: boolean };

export function estimate(qty: number, bothSides: boolean): Estimate {
  if (qty < MIN_SHIRTS) return { kind: "minimum" };
  const tier = RATES.find((r) => qty >= r.min && qty <= r.max);
  if (!tier) return { kind: "ask", qty };
  const rate = bothSides ? tier.bothSides : tier.oneSide;
  return { kind: "priced", qty, rate, total: rate * qty, bothSides };
}

export function estimateTotal(e: Estimate): string {
  if (e.kind === "priced") return `$${e.total}`;
  return e.kind === "ask" ? "Ask us" : "-";
}

export function estimateBreakdown(e: Estimate): string {
  if (e.kind === "minimum") return `Minimum ${MIN_SHIRTS} shirts`;
  if (e.kind === "ask") return `${e.qty} shirts · bulk price on WhatsApp`;
  return `${e.qty} × $${e.rate} · ${e.bothSides ? "front + back" : "one side"}`;
}
