// Unit conversion helpers — replaced mathjs (1.5 MB) with native JS arithmetic.
// All operations were simple multiply/divide; mathjs was massive overkill.

type ConversionType =
  | "centsToDollars"
  | "dollarsToCents"
  | "bitsToMb"
  | "mbToBits"
  | "bytesToGb"
  | "gbToBytes";

const conversionConfig: Record<
  ConversionType,
  { fn: (v: number) => number; precision: number }
> = {
  centsToDollars: { fn: (v) => v / 100, precision: 2 },
  dollarsToCents: { fn: (v) => v * 100, precision: 0 },
  bitsToMb: { fn: (v) => v / 1024 / 1024, precision: 2 },
  mbToBits: { fn: (v) => v * 1024 * 1024, precision: 0 },
  bytesToGb: { fn: (v) => v / 1024 / 1024 / 1024, precision: 2 },
  gbToBytes: { fn: (v) => v * 1024 * 1024 * 1024, precision: 0 },
};

export function unitConversion(type: ConversionType, value?: number | string) {
  if (!value) return 0;
  const cfg = conversionConfig[type];
  if (!cfg) throw new Error(`Invalid conversion type: ${type}`);
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Number(cfg.fn(n).toFixed(cfg.precision));
}

// Tiny safe evaluator for arithmetic-only expressions. Strict whitelist:
// digits, decimal point, scientific notation, whitespace, parentheses, and
// + - * /. Anything else throws — defends against accidental string
// injection. Keeps the API of the old mathjs-backed function.
const ARITHMETIC_RE = /^[\s\d.+\-*/()eE]+$/;

export function evaluateWithPrecision(expression: string, precision = 2) {
  if (typeof expression !== "string") return 0;
  if (!ARITHMETIC_RE.test(expression)) {
    throw new Error(`evaluateWithPrecision: unsafe expression: ${expression}`);
  }
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    `"use strict"; return (${expression});`
  ) as () => number;
  const result = fn();
  if (!Number.isFinite(result)) return 0;
  return Number(result.toFixed(precision));
}
