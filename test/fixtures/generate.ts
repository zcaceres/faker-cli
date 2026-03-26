/**
 * Fixture generator: calls every faker method with a deterministic seed
 * and captures the return value + type metadata.
 *
 * Run: bun run test/fixtures/generate.ts
 * Output: test/fixtures/return-types.json, test/fixtures/requires-args.json
 */

import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";
import { join, dirname } from "path";

const SEED = 12345;
const REF_DATE = "2025-01-01T00:00:00.000Z";

// Modules on SimpleFaker (number, string, datatype)
// + modules on Faker (airline, animal, book, etc.)
// We enumerate dynamically to avoid hardcoding.

const SKIP_MODULES = new Set([
  // helpers requires callbacks/arrays/templates — not CLI-friendly
  "helpers",
  // These are not data-generating modules
  "rawDefinitions",
  "definitions",
  "defaultRefDate",
]);

// Methods that are known to not be data generators
const SKIP_METHODS = new Set([
  "constructor",
  "faker", // back-reference
]);

interface FixtureEntry {
  module: string;
  method: string;
  returnType:
    | "string"
    | "number"
    | "boolean"
    | "bigint"
    | "Date"
    | "Date[]"
    | "number[]"
    | "object";
  raw: unknown;
  objectKeys?: string[];
}

interface RequiresArgsEntry {
  module: string;
  method: string;
  error: string;
}

function classifyReturnType(
  value: unknown
): FixtureEntry["returnType"] | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "bigint") return "bigint";
  if (value instanceof Date) return "Date";
  if (Array.isArray(value)) {
    if (value.length > 0 && value[0] instanceof Date) return "Date[]";
    if (value.length > 0 && typeof value[0] === "number") return "number[]";
    // fallback — treat as object
    return "object";
  }
  if (typeof value === "object") return "object";
  return null;
}

function serializeForFixture(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return value.map((v) => serializeForFixture(v));
  }
  if (typeof value === "object" && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = serializeForFixture(v);
    }
    return result;
  }
  return value;
}

function getAllMethods(obj: object): string[] {
  const methods = new Set<string>();
  let proto: object | null = Object.getPrototypeOf(obj);
  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (SKIP_METHODS.has(name)) continue;
      if (name.startsWith("_")) continue;
      const descriptor = Object.getOwnPropertyDescriptor(proto, name);
      // Skip getters/setters — only want callable methods
      if (descriptor && typeof descriptor.value === "function") {
        methods.add(name);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return [...methods].sort();
}

function getModules(): string[] {
  const modules: string[] = [];
  // Collect all property names from the full prototype chain
  const allKeys = new Set<string>();
  let proto: any = faker;
  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      allKeys.add(name);
    }
    proto = Object.getPrototypeOf(proto);
  }
  for (const key of allKeys) {
    if (SKIP_MODULES.has(key)) continue;
    if (key.startsWith("_")) continue;
    try {
      const val = (faker as any)[key];
      if (
        typeof val === "object" &&
        val !== null &&
        typeof val.constructor === "function" &&
        val.constructor.name !== "Object"
      ) {
        modules.push(key);
      }
    } catch {
      // skip inaccessible properties
    }
  }
  return modules.sort();
}

// --- Main ---

faker.seed(SEED);
faker.setDefaultRefDate(new Date(REF_DATE));

const fixtures: FixtureEntry[] = [];
const requiresArgs: RequiresArgsEntry[] = [];
const modules = getModules();

console.log(`Found ${modules.length} modules: ${modules.join(", ")}`);

for (const modName of modules) {
  const mod = (faker as any)[modName];
  const methods = getAllMethods(mod);

  for (const methodName of methods) {
    // Reset seed + refDate before each call for independence
    faker.seed(SEED);
    faker.setDefaultRefDate(new Date(REF_DATE));

    try {
      const result = (mod as any)[methodName]();
      const returnType = classifyReturnType(result);

      if (returnType === null) {
        console.warn(
          `  SKIP ${modName}.${methodName}: returned ${typeof result}`
        );
        continue;
      }

      const entry: FixtureEntry = {
        module: modName,
        method: methodName,
        returnType,
        raw: serializeForFixture(result),
      };

      if (returnType === "object" && !Array.isArray(result)) {
        entry.objectKeys = Object.keys(result as object);
      }

      fixtures.push(entry);
    } catch (err: any) {
      requiresArgs.push({
        module: modName,
        method: methodName,
        error: err.message?.slice(0, 200) ?? String(err),
      });
    }
  }
}

// Summary
const typeCounts: Record<string, number> = {};
for (const f of fixtures) {
  typeCounts[f.returnType] = (typeCounts[f.returnType] || 0) + 1;
}

console.log(`\nGenerated ${fixtures.length} fixtures:`);
for (const [type, count] of Object.entries(typeCounts).sort()) {
  console.log(`  ${type}: ${count}`);
}
console.log(`\nSkipped ${requiresArgs.length} methods (require args)`);

const fixturesDir = dirname(new URL(import.meta.url).pathname);

writeFileSync(
  join(fixturesDir, "return-types.json"),
  JSON.stringify(fixtures, null, 2) + "\n"
);

writeFileSync(
  join(fixturesDir, "requires-args.json"),
  JSON.stringify(requiresArgs, null, 2) + "\n"
);

console.log("\nWrote: test/fixtures/return-types.json");
console.log("Wrote: test/fixtures/requires-args.json");
