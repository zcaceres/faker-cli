/**
 * Method and module descriptions for --describe flag.
 */
import metadata from "./metadata.json";
import { listModules, listMethods } from "./enumerate";

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

/** One-line descriptions for each module. */
const MODULE_DESCRIPTIONS: Record<string, string> = {
  airline: "Airlines, airports, and flight data",
  animal: "Animal types and breeds",
  book: "Books, authors, genres, publishers",
  color: "Colors in various formats (hex, rgb, hsl)",
  commerce: "Products, prices, departments",
  company: "Company names and catch phrases",
  database: "Database engines, columns, types",
  datatype: "Basic data types (boolean)",
  date: "Dates, timestamps, and time ranges",
  finance: "Accounts, currencies, transactions",
  food: "Food items, ingredients, descriptions",
  git: "Git commits, branches, messages",
  hacker: "Hacker-style phrases and abbreviations",
  helpers: "Utility methods: pick from arrays, templates, regex",
  image: "Placeholder image URLs",
  internet: "Emails, URLs, IPs, usernames, passwords",
  location: "Addresses, cities, countries, coordinates",
  lorem: "Lorem ipsum text generation",
  music: "Music genres and instruments",
  number: "Integers, floats, binary, hex, bigint",
  person: "Names, jobs, bios, genders",
  phone: "Phone numbers in various formats",
  science: "Chemical elements and scientific units",
  string: "UUIDs, alphanumeric, nanoid, and more",
  system: "File paths, MIME types, extensions",
  vehicle: "Makes, models, VINs, colors",
  word: "Random words: nouns, verbs, adjectives",
};

export function getModuleDescription(moduleName: string): string {
  return MODULE_DESCRIPTIONS[moduleName] ?? "";
}

export function getMethodInfo(path: string): MethodMetadata | null {
  return index[path] ?? null;
}

/** Transform JS-style example to CLI syntax. */
function toCLIExample(example: string): string {
  // "faker.number.int(100) // 52" → "faker number.int 100  # 52"
  // "faker.number.int({ min: 10, max: 100 }) // 57" → "faker number.int '{\"min\":10,\"max\":100}'  # 57"
  // "faker.number.int() // 42" → "faker number.int  # 42"
  return example
    .replace(/^faker\.(\w+\.\w+)\(\)(.*)/, (_, path, rest) => {
      const comment = rest.replace(/\s*\/\/\s*/, "  # ");
      return `faker ${path}${comment}`;
    })
    .replace(
      /^faker\.(\w+\.\w+)\(([^)]+)\)(.*)/,
      (_, path, args, rest) => {
        const comment = rest.replace(/\s*\/\/\s*/, "  # ");
        // If args look like an object, wrap in quotes
        const trimmed = args.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          return `faker ${path} '${trimmed}'${comment}`;
        }
        // If it's a simple string in quotes, keep quotes
        if (trimmed.startsWith("'") || trimmed.startsWith('"')) {
          return `faker ${path} ${trimmed}${comment}`;
        }
        return `faker ${path} ${trimmed}${comment}`;
      }
    );
}

/** Format full method description (for --describe module.method). */
export function formatMethodDescription(
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

  // Examples in CLI syntax
  if (info.examples && info.examples.length > 0) {
    lines.push("");
    lines.push("  Examples:");
    for (const ex of info.examples.slice(0, 3)) {
      lines.push(`    ${toCLIExample(ex)}`);
    }
  }

  return lines.join("\n");
}

/** Format module overview (for --describe module). */
export function formatModuleDescription(
  fakerInstance: any,
  moduleName: string
): string {
  const methods = listMethods(fakerInstance, moduleName);
  const desc = getModuleDescription(moduleName);
  const lines: string[] = [];

  lines.push(`${moduleName}${desc ? ` — ${desc}` : ""}`);
  lines.push(`${methods.length} methods:`);
  lines.push("");

  // Find max method signature length for alignment
  const entries: Array<{ sig: string; desc: string }> = [];
  for (const method of methods) {
    const info = index[`${moduleName}.${method}`];
    const paramStr = info
      ? info.params.map((p) => `${p.name}${p.optional ? "?" : ""}`).join(", ")
      : "";
    const sig = paramStr ? `${method}(${paramStr})` : `${method}()`;
    const methodDesc = info?.description ?? "";
    entries.push({ sig, desc: methodDesc });
  }

  const maxSig = Math.max(...entries.map((e) => e.sig.length));
  for (const e of entries) {
    const padding = " ".repeat(Math.max(2, maxSig - e.sig.length + 2));
    lines.push(`  ${e.sig}${padding}${e.desc}`);
  }

  lines.push("");
  lines.push(
    `Run: faker --describe ${moduleName}.<method> for full details.`
  );

  return lines.join("\n");
}

/**
 * Handle --describe flag. Returns formatted string or throws with guided error.
 */
export function describe(fakerInstance: any, target: string): string {
  // Module-level: no dot
  if (!target.includes(".")) {
    const modules = listModules(fakerInstance);
    if (!modules.includes(target)) {
      throw new Error(
        `Unknown module "${target}". Run: faker --list`
      );
    }
    return formatModuleDescription(fakerInstance, target);
  }

  // Method-level: has dot
  const info = getMethodInfo(target);
  if (!info) {
    const [moduleName, methodName] = target.split(".");
    const modules = listModules(fakerInstance);
    if (!modules.includes(moduleName)) {
      throw new Error(
        `Unknown module "${moduleName}". Run: faker --list`
      );
    }
    throw new Error(
      `Unknown method "${methodName}" in ${moduleName}. Run: faker --describe ${moduleName}`
    );
  }
  return formatMethodDescription(target, info);
}
