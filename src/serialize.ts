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

/** Escape a value for CSV (RFC 4180). */
function csvEscape(value: unknown): string {
  const prepared = prepareValue(value);
  if (prepared === null || prepared === undefined) return "";
  // Objects/arrays: JSON stringify so they don't become [object Object]
  const str =
    typeof prepared === "object" && prepared !== null
      ? JSON.stringify(prepared)
      : String(prepared);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Serialize an array of flat objects as CSV with a header row. */
export function serializeCSV(rows: unknown[]): string {
  if (rows.length === 0) return "";

  const first = prepareValue(rows[0]);

  // Scalar values: one column, no header
  if (typeof first !== "object" || first === null || Array.isArray(first)) {
    return rows.map((r) => csvEscape(r)).join("\n");
  }

  // Object values: extract headers from first row
  const headers = Object.keys(first as Record<string, unknown>);
  const lines: string[] = [headers.map((h) => csvEscape(h)).join(",")];

  for (const row of rows) {
    const prepared = prepareValue(row) as Record<string, unknown>;
    lines.push(headers.map((h) => csvEscape(prepared[h])).join(","));
  }

  return lines.join("\n");
}
