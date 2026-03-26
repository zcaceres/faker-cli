/**
 * Schema resolution: recursively resolves faker method references in a JSON schema.
 *
 * String values matching "module.method" or "module.method(args)" are invoked.
 * All other values pass through as literals.
 */
import { listModules, listMethods } from "./enumerate";
import { invoke } from "./resolver";

/**
 * Parse a schema string value that may contain a faker method reference.
 * Returns { path, rawArg } if it's a faker call, or null if it's a literal.
 *
 * Examples:
 *   "person.fullName"                    → { path: "person.fullName", rawArg: undefined }
 *   "number.int({\"min\":1,\"max\":10})" → { path: "number.int", rawArg: '{"min":1,"max":10}' }
 *   "hello.world"                        → null (unknown module)
 *   "just a string"                      → null
 */
function parseFakerRef(
  value: string,
  modules: Set<string>,
  methodCache: Map<string, Set<string>>
): { path: string; rawArg?: string } | null {
  // Check for parenthesized args
  let pathPart = value;
  let argPart: string | undefined;

  const parenIdx = value.indexOf("(");
  if (parenIdx !== -1) {
    if (!value.endsWith(")")) return null; // malformed — treat as literal
    pathPart = value.slice(0, parenIdx);
    argPart = value.slice(parenIdx + 1, -1);
  }

  // Must be exactly module.method
  const dotIdx = pathPart.indexOf(".");
  if (dotIdx === -1 || dotIdx !== pathPart.lastIndexOf(".")) return null;

  const moduleName = pathPart.slice(0, dotIdx);
  const methodName = pathPart.slice(dotIdx + 1);

  if (!modules.has(moduleName)) return null;

  let methods = methodCache.get(moduleName);
  if (!methods) {
    // Will be populated by caller — shouldn't happen, but handle gracefully
    return null;
  }

  if (!methods.has(methodName)) return null;

  return { path: pathPart, rawArg: argPart };
}

/**
 * Resolve a schema value recursively.
 * - Strings matching faker methods are invoked
 * - Objects and arrays are recursed into
 * - Everything else passes through as a literal
 */
export function resolveSchema(fakerInstance: any, schema: unknown): unknown {
  // Build caches once for the entire resolution
  const modules = new Set(listModules(fakerInstance));
  const methodCache = new Map<string, Set<string>>();
  for (const mod of modules) {
    methodCache.set(mod, new Set(listMethods(fakerInstance, mod)));
  }

  return resolveValue(fakerInstance, schema, modules, methodCache);
}

function resolveValue(
  fakerInstance: any,
  value: unknown,
  modules: Set<string>,
  methodCache: Map<string, Set<string>>
): unknown {
  if (typeof value === "string") {
    const ref = parseFakerRef(value, modules, methodCache);
    if (ref) {
      return invoke(fakerInstance, ref.path, ref.rawArg);
    }
    return value; // literal string
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      resolveValue(fakerInstance, item, modules, methodCache)
    );
  }

  if (typeof value === "object" && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = resolveValue(fakerInstance, val, modules, methodCache);
    }
    return result;
  }

  // number, boolean, null — pass through
  return value;
}
