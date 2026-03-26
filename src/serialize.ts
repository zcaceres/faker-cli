/**
 * Serializes faker return values to JSON strings.
 * Handles all 8 return type categories:
 * string, number, boolean, bigint, Date, Date[], number[], object
 */
export function serialize(value: unknown): string {
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  if (value instanceof Date) return JSON.stringify(value.toISOString());
  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((v) => (v instanceof Date ? v.toISOString() : v))
    );
  }
  return JSON.stringify(value);
}
