/**
 * Enumerates faker modules and their methods.
 */
import { faker } from "@faker-js/faker";

const SKIP_MODULES = new Set([
  "helpers",
  "rawDefinitions",
  "definitions",
  "defaultRefDate",
]);

const SKIP_METHODS = new Set(["constructor", "faker"]);

/** Walk prototype chain to find all callable methods on a module. */
function getAllMethods(obj: object): string[] {
  const methods = new Set<string>();
  let proto: object | null = Object.getPrototypeOf(obj);
  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (SKIP_METHODS.has(name) || name.startsWith("_")) continue;
      const descriptor = Object.getOwnPropertyDescriptor(proto, name);
      if (descriptor && typeof descriptor.value === "function") {
        methods.add(name);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return [...methods].sort();
}

/** Get all faker module names. */
export function listModules(): string[] {
  const modules: string[] = [];
  const allKeys = new Set<string>();
  let proto: any = faker;
  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      allKeys.add(name);
    }
    proto = Object.getPrototypeOf(proto);
  }
  for (const key of allKeys) {
    if (SKIP_MODULES.has(key) || key.startsWith("_")) continue;
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
      // skip
    }
  }
  return modules.sort();
}

/** Get all method names for a given module. */
export function listMethods(moduleName: string): string[] {
  const mod = (faker as any)[moduleName];
  if (!mod || typeof mod !== "object") {
    throw new Error(`Unknown module: ${moduleName}`);
  }
  return getAllMethods(mod);
}
