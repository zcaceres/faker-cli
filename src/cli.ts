#!/usr/bin/env bun
/**
 * faker — Agent-friendly CLI for @faker-js/faker
 */

import { faker as defaultFaker, allFakers } from "@faker-js/faker";
import { invoke } from "./resolver";
import { serialize, serializeCSV } from "./serialize";
import { listModules, listMethods } from "./enumerate";
import { resolveSchema } from "./schema";
import { formatColumns, formatTable } from "./format";
import { describe, getModuleDescription } from "./describe";

const args = process.argv.slice(2);

// Parse flags
let count = 1;
let seed: number | undefined;
let locale: string | undefined;
let refDate: string | undefined;
let schema: string | undefined;
let format: "json" | "ndjson" | "csv" = "json";
let describeTarget: string | undefined;
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
    if (count > 100000) {
      console.error("Error: --count maximum is 100000");
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

  if (arg === "--format" || arg === "-f") {
    if (i + 1 >= args.length) {
      console.error("Error: --format requires a value");
      process.exit(1);
    }
    const val = args[++i];
    if (val !== "json" && val !== "ndjson" && val !== "csv") {
      console.error(
        `Error: Unknown format "${val}". Available: json, ndjson, csv`
      );
      process.exit(1);
    }
    format = val;
    continue;
  }

  if (arg === "--describe" || arg === "--info") {
    if (i + 1 >= args.length || args[i + 1].startsWith("-")) {
      describeTarget = "__self__";
    } else {
      describeTarget = args[++i];
    }
    continue;
  }

  if (arg === "--version" || arg === "-v" || arg === "-V") {
    const pkg = require("../package.json");
    console.log(pkg.version);
    process.exit(0);
  }

  if (arg === "--help" || arg === "-h") {
    console.log(`faker — Agent-friendly CLI for @faker-js/faker

Usage:
  faker <module.method> [args] [options]
  faker --schema <json|file> [options]
  faker --describe <module|module.method>
  faker --list [module]

Examples:
  faker person.firstName
  faker number.int '{"min":1,"max":100}'
  faker helpers.fake "{{person.firstName}} {{person.lastName}}"
  faker person.firstName --count 5 --format ndjson
  faker person.firstName --seed 42 --locale de
  faker --schema '{"name":"person.fullName","email":"internet.email"}'
  faker --schema schema.json --count 10
  faker date.past --ref-date 2025-01-01T00:00:00.000Z
  faker --describe person
  faker --describe number.int

Options:
  --describe TARGET   Describe a module or method (params, types, examples)
  --list, -l          List module or method names
  --count N, -n N     Generate N values (output as JSON array)
  --seed N, -s N      Set seed for reproducible output
  --locale L, -L L    Locale code (e.g. de, en_US, ja). Default: en
  --ref-date DATE     Reference date for date methods (ISO 8601). Default: now
  --schema JSON|FILE  Generate structured object from schema
  --format FMT, -f    Output format: json (default), ndjson, csv
  --version, -v       Show version
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

  // Extra positional args
  console.error(
    `Warning: extra argument "${arg}" ignored. faker takes at most two positional args: module.method [arg]`
  );
}

// Resolve faker instance
let f: any;
if (locale) {
  f = (allFakers as any)[locale];
  if (!f) {
    const available = Object.keys(allFakers).sort().join(", ");
    console.error(
      `Error: Unknown locale "${locale}". Available: ${available}`
    );
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

// Handle --describe
if (describeTarget) {
  try {
    console.log(describe(f, describeTarget));
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
  process.exit(0);
}

// Handle --list
if (listFlag) {
  if (listTarget) {
    try {
      const methods = listMethods(f, listTarget);
      if (process.stdout.isTTY) {
        console.log(formatColumns(methods, listTarget));
      } else {
        console.log(JSON.stringify(methods));
      }
    } catch (err: any) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  } else {
    const modules = listModules(f);
    if (process.stdout.isTTY) {
      const rows: Array<[string, string]> = modules.map((m) => [
        m,
        getModuleDescription(m),
      ]);
      console.log(
        formatTable(
          rows,
          "Modules",
          "Run: faker --describe <module> for methods."
        )
      );
    } else {
      console.log(JSON.stringify(modules));
    }
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

    const schemaTrimmed = schema.trim();
    if (schemaTrimmed.startsWith("{") || schemaTrimmed.startsWith("[")) {
      schemaObj = JSON.parse(schemaTrimmed);
    } else {
      const text = await Bun.file(schema).text();
      schemaObj = JSON.parse(text);
    }

    if (count === 1 && format !== "csv") {
      const result = resolveSchema(f, schemaObj);
      console.log(serialize(result));
    } else if (format === "ndjson") {
      for (let i = 0; i < count; i++) {
        console.log(serialize(resolveSchema(f, schemaObj)));
      }
    } else if (format === "csv") {
      const results: unknown[] = [];
      for (let i = 0; i < Math.max(count, 1); i++) {
        results.push(resolveSchema(f, schemaObj));
      }
      console.log(serializeCSV(results));
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
  if (count === 1 && format !== "csv") {
    const result = invoke(f, path, rawArg);
    console.log(serialize(result));
  } else if (format === "ndjson") {
    for (let i = 0; i < count; i++) {
      console.log(serialize(invoke(f, path, rawArg)));
    }
  } else if (format === "csv") {
    const results: unknown[] = [];
    for (let i = 0; i < Math.max(count, 1); i++) {
      results.push(invoke(f, path, rawArg));
    }
    console.log(serializeCSV(results));
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
