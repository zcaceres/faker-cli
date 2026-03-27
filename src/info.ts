/**
 * Method info lookup and formatting for --info flag.
 */
import metadata from "./metadata.json";

interface ParamInfo {
  name: string;
  type: string;
  optional: boolean;
}

interface MethodMetadata {
  params: ParamInfo[];
  returnType: string;
  description?: string;
  examples?: string[];
}

const index = metadata as Record<string, MethodMetadata>;

export function getMethodInfo(path: string): MethodMetadata | null {
  return index[path] ?? null;
}

export function formatMethodInfo(
  path: string,
  info: MethodMetadata
): string {
  const lines: string[] = [];

  // Signature
  const paramStr = info.params
    .map((p) => `${p.name}${p.optional ? "?" : ""}`)
    .join(", ");
  lines.push(`${path}(${paramStr})`);

  // Description
  if (info.description) {
    lines.push(`  ${info.description}`);
  }
  lines.push("");

  // Parameters
  if (info.params.length > 0) {
    for (const p of info.params) {
      lines.push(
        `  ${p.name}${p.optional ? " (optional)" : ""}: ${p.type}`
      );
    }
    lines.push("");
  }

  // Return type
  lines.push(`  Returns: ${info.returnType}`);

  // Examples
  if (info.examples && info.examples.length > 0) {
    lines.push("");
    lines.push("  Examples:");
    for (const ex of info.examples.slice(0, 3)) {
      lines.push(`    ${ex}`);
    }
  }

  return lines.join("\n");
}
