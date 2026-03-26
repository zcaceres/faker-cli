#!/usr/bin/env bun
/**
 * faker — Agent-friendly CLI for @faker-js/faker
 *
 * Usage:
 *   faker person.firstName
 *   faker number.int '{"min":1,"max":100}'
 *   faker --schema '{"name":"person.fullName","email":"internet.email"}'
 *   faker --schema schema.json --count 10 --locale de --seed 42
 *   faker --list
 *   faker --list person
 */

import { faker as defaultFaker, allFakers } from "@faker-js/faker";
import { invoke } from "./resolver";
import { serialize } from "./serialize";
import { listModules, listMethods } from "./enumerate";
import { resolveSchema } from "./schema";

const args = process.argv.slice(2);

// Parse flags
let count = 1;
let seed: number | undefined;
let locale: string | undefined;
let refDate: string | undefined;
let schema: string | undefined;
let listFlag = false;
let listTarget: string | undefined;
let path: string | undefined;
let rawArg: string | undefined;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--list" || arg === "-l") {
    listFlag = true;
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

  if (arg === "--locale" || arg === "-L") {
    if (i + 1 >= args.length) {
      console.error("Error: --locale requires a value");
      process.exit(1);
    }
    locale = args[++i];
    continue;
  }

  if (arg === "--ref-date") {
    if (i + 1 >= args.length) {
      console.error("Error: --ref-date requires a value");
      process.exit(1);
    }
    refDate = args[++i];
    continue;
  }

  if (arg === "--schema") {
    if (i + 1 >= args.length) {
      console.error("Error: --schema requires a value");
      process.exit(1);
    }
    schema = args[++i];
    continue;
  }

  if (arg === "--help" || arg === "-h") {
    console.log(`faker — Agent-friendly CLI for @faker-js/faker

Usage:
  faker <module.method> [args] [options]
  faker --schema <json|file> [options]
  faker --list [module]

Examples:
  faker person.firstName
  faker number.int '{"min":1,"max":100}'
  faker airline.airline
  faker person.firstName --count 5
  faker person.firstName --seed 42 --locale de
  faker --schema '{"name":"person.fullName","email":"internet.email"}'
  faker --schema schema.json --count 10
  faker date.past --ref-date 2025-01-01T00:00:00.000Z

Options:
  --list, -l          List modules or methods
  --count N, -n N     Generate N values (output as JSON array)
  --seed N, -s N      Set seed for reproducible output
  --locale L, -L L    Locale code (e.g. de, en_US, ja). Default: en
  --ref-date DATE     Reference date for date methods (ISO 8601). Default: now
  --schema JSON|FILE  Generate structured object from schema
  --help, -h          Show this help`);
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

// Resolve faker instance
let f: any;
if (locale) {
  f = (allFakers as any)[locale];
  if (!f) {
    const available = Object.keys(allFakers).sort().join(", ");
    console.error(`Error: Unknown locale "${locale}". Available: ${available}`);
    process.exit(1);
  }
} else {
  f = defaultFaker;
}

// Set seed
if (seed !== undefined) {
  f.seed(seed);
}

// Set ref date
if (refDate) {
  const d = new Date(refDate);
  if (isNaN(d.getTime())) {
    console.error(
      `Error: Invalid ref-date "${refDate}". Use ISO 8601 format (e.g. 2025-01-01T00:00:00.000Z)`
    );
    process.exit(1);
  }
  f.setDefaultRefDate(d);
}

// Handle --list
if (listFlag) {
  if (listTarget) {
    try {
      const methods = listMethods(f, listTarget);
      console.log(JSON.stringify(methods));
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(JSON.stringify(listModules(f)));
  }
  process.exit(0);
}

// Handle --schema
if (schema) {
  if (path) {
    console.error(
      "Error: Cannot use --schema with a positional module.method argument"
    );
    process.exit(1);
  }

  try {
    let schemaObj: unknown;

    if (schema.startsWith("{") || schema.startsWith("[")) {
      schemaObj = JSON.parse(schema);
    } else {
      const text = await Bun.file(schema).text();
      schemaObj = JSON.parse(text);
    }

    if (count === 1) {
      const result = resolveSchema(f, schemaObj);
      console.log(serialize(result));
    } else {
      const results: unknown[] = [];
      for (let i = 0; i < count; i++) {
        results.push(resolveSchema(f, schemaObj));
      }
      console.log(serialize(results));
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  process.exit(0);
}

// Handle module.method
if (!path) {
  console.error("Error: No method specified. Use --help for usage.");
  process.exit(1);
}

try {
  if (count === 1) {
    const result = invoke(f, path, rawArg);
    console.log(serialize(result));
  } else {
    const results: unknown[] = [];
    for (let i = 0; i < count; i++) {
      results.push(invoke(f, path, rawArg));
    }
    console.log(serialize(results));
  }
} catch (err: any) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
