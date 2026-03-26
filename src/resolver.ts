/**
 * Resolves "module.method" strings to faker function calls.
 */
import { faker } from "@faker-js/faker";
import { listModules, listMethods } from "./enumerate";

/** Parse a CLI argument into a value to pass to faker. */
function parseArg(arg: string): unknown {
  // Try JSON parse first (handles objects, arrays, numbers, booleans, null)
  try {
    return JSON.parse(arg);
  } catch {
    // Fall back to raw string
    return arg;
  }
}

/**
 * Resolve and invoke a faker method.
 * @param path - "module.method" string (e.g. "person.firstName")
 * @param rawArg - Optional argument string from CLI
 * @returns The raw return value from faker
 */
export function invoke(path: string, rawArg?: string): unknown {
  const parts = path.split(".");
  if (parts.length !== 2) {
    throw new Error(
      `Invalid path "${path}". Expected format: module.method (e.g. person.firstName)`
    );
  }

  const [moduleName, methodName] = parts;

  const modules = listModules();
  if (!modules.includes(moduleName)) {
    throw new Error(
      `Unknown module "${moduleName}". Available: ${modules.join(", ")}`
    );
  }

  const methods = listMethods(moduleName);
  if (!methods.includes(methodName)) {
    throw new Error(
      `Unknown method "${moduleName}.${methodName}". Available: ${methods.join(", ")}`
    );
  }

  const mod = (faker as any)[moduleName];
  const fn = mod[methodName].bind(mod);

  if (rawArg !== undefined) {
    const parsed = parseArg(rawArg);
    return fn(parsed);
  }
  return fn();
}

/** Set the faker seed for reproducible output. */
export function setSeed(seed: number): void {
  faker.seed(seed);
}
