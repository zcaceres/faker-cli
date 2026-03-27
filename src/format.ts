/**
 * Formatting utilities for human-readable CLI output.
 */

/** Format items as aligned columns for TTY display. */
export function formatColumns(items: string[], header?: string): string {
  if (items.length === 0) return header ? `${header}:\n  (none)` : "(none)";

  const maxLen = Math.max(...items.map((s) => s.length));
  const colWidth = maxLen + 2;
  const termWidth = process.stdout.columns || 80;
  const indent = 2;
  const cols = Math.max(1, Math.floor((termWidth - indent) / colWidth));

  const lines: string[] = [];
  if (header) lines.push(`${header}:`);

  for (let i = 0; i < items.length; i += cols) {
    const row = items
      .slice(i, i + cols)
      .map((s) => s.padEnd(colWidth))
      .join("");
    lines.push(" ".repeat(indent) + row.trimEnd());
  }

  return lines.join("\n");
}
