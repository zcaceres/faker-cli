#!/usr/bin/env bun
/**
 * faker — Agent-friendly CLI for @faker-js/faker
 *
 * Usage:
 *   faker person.firstName
 *   faker number.int '{"min":1,"max":100}'
 *   faker airline.airline
 *   faker person.firstName --count 5
 *   faker person.firstName --seed 42
 *   faker --list
 *   faker --list person
 */

import { invoke, setSeed } from "./resolver";
import { serialize } from "./serialize";
import { listModules, listMethods } from "./enumerate";

const args = process.argv.slice(2);

// Parse flags
let count = 1;
let seed: number | undefined;
let listFlag = false;
let listTarget: string | undefined;
let path: string | undefined;
let rawArg: string | undefined;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--list" || arg === "-l") {
    listFlag = true;
    // Check if next arg is a module name (not a flag)
    if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
      listTarget = args[++i];
    }
    continue;
  }

  if (arg === "--count" || arg === "-n") {
    count = parseInt(args[++i], 10);
    if (isNaN(count) || count < 1) {
      console.error("Error: --count must be a positive integer");
      process.exit(1);
    }
    continue;
  }

  if (arg === "--seed" || arg === "-s") {
    seed = parseInt(args[++i], 10);
    if (isNaN(seed)) {
      console.error("Error: --seed must be a number");
      process.exit(1);
    }
    continue;
  }

  if (arg === "--help" || arg === "-h") {
    console.log(`faker — Agent-friendly CLI for @faker-js/faker

Usage:
  faker <module.method> [options] [-- args]
  faker --list [module]

Examples:
  faker person.firstName
  faker number.int '{"min":1,"max":100}'
  faker airline.airline
  faker person.firstName --count 5
  faker person.firstName --seed 42
  faker --list
  faker --list person

Options:
  --list, -l       List modules or methods
  --count N, -n N  Generate N values (output as JSON array)
  --seed N, -s N   Set seed for reproducible output
  --help, -h       Show this help`);
    process.exit(0);
  }

  // First non-flag arg is the path
  if (!path) {
    path = arg;
    continue;
  }

  // Second non-flag arg is the method argument
  if (!rawArg) {
    rawArg = arg;
    continue;
  }
}

// Handle --list
if (listFlag) {
  if (listTarget) {
    try {
      const methods = listMethods(listTarget);
      console.log(JSON.stringify(methods));
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(JSON.stringify(listModules()));
  }
  process.exit(0);
}

// Must have a path
if (!path) {
  console.error("Error: No method specified. Use --help for usage.");
  process.exit(1);
}

// Set seed if provided
if (seed !== undefined) {
  setSeed(seed);
}

try {
  if (count === 1) {
    const result = invoke(path, rawArg);
    console.log(serialize(result));
  } else {
    const results: unknown[] = [];
    for (let i = 0; i < count; i++) {
      results.push(invoke(path, rawArg));
    }
    // Serialize each value properly then build array
    // We need to handle this at the array level for proper JSON
    const serializedItems = results.map((r) => {
      if (typeof r === "bigint") return r.toString();
      if (r instanceof Date) return r.toISOString();
      return r;
    });
    console.log(JSON.stringify(serializedItems));
  }
} catch (err: any) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
