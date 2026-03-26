/**
 * Serializes faker return values to JSON strings.
 * Handles BigInt and Date at any nesting depth.
 */

function prepareValue(v: unknown): unknown {
  if (typeof v === "bigint") return v.toString();
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(prepareValue);
  if (typeof v === "object" && v !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) out[k] = prepareValue(val);
    return out;
  }
  return v;
}

export function serialize(value: unknown): string {
  return JSON.stringify(prepareValue(value));
}
