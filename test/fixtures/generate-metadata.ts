/**
 * Metadata generator: parses faker .d.ts files to extract method signatures.
 * Uses TypeScript compiler API to get parameter names, types, and return types.
 *
 * Run: bun run test/fixtures/generate-metadata.ts
 * Output: src/metadata.json
 */

import * as ts from "typescript";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { faker } from "@faker-js/faker";
import { listModules, listMethods } from "../../src/enumerate";

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

type MetadataIndex = Record<string, MethodMetadata>;

// Find the main .d.ts file
const dtsPath = join(
  process.cwd(),
  "node_modules/@faker-js/faker/dist/airline-eVQV6kbz.d.ts"
);
const dtsContent = readFileSync(dtsPath, "utf-8");

const sourceFile = ts.createSourceFile(
  "faker.d.ts",
  dtsContent,
  ts.ScriptTarget.Latest,
  true
);

// Map module names to expected .d.ts class names
// Runtime constructor names are minified, so we derive from convention:
// "person" -> "PersonModule", "date" -> "DateModule" / "SimpleDateModule"
const modules = listModules(faker);

// Build className -> moduleName map
const classToModule = new Map<string, string>();
for (const modName of modules) {
  const capitalized = modName.charAt(0).toUpperCase() + modName.slice(1);
  classToModule.set(`${capitalized}Module`, modName);
  // Some modules have Simple* variants (date, location, helpers)
  classToModule.set(`Simple${capitalized}Module`, modName);
}

const metadata: MetadataIndex = {};

function getTypeString(node: ts.TypeNode | undefined): string {
  if (!node) return "unknown";
  return dtsContent.slice(node.pos, node.end).trim();
}

function getJsDocDescription(node: ts.Node): string | undefined {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;
  if (!jsDocs || jsDocs.length === 0) return undefined;
  const doc = jsDocs[0];
  if (!doc.comment) return undefined;
  if (typeof doc.comment === "string") return doc.comment.split("\n")[0].trim();
  // JSDocComment is an array of text/link nodes
  return (doc.comment as any[])
    .map((c: any) => c.text || "")
    .join("")
    .split("\n")[0]
    .trim();
}

function getJsDocExamples(node: ts.Node): string[] | undefined {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined;
  if (!jsDocs || jsDocs.length === 0) return undefined;
  const doc = jsDocs[0];
  if (!doc.tags) return undefined;

  const examples: string[] = [];
  for (const tag of doc.tags) {
    if (tag.tagName.text === "example") {
      const comment = tag.comment;
      if (typeof comment === "string") {
        for (const line of comment.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith("faker.")) {
            examples.push(trimmed);
          }
        }
      } else if (Array.isArray(comment)) {
        for (const part of comment as any[]) {
          const text = part.text || "";
          for (const line of text.split("\n")) {
            const trimmed = line.trim();
            if (trimmed.startsWith("faker.")) {
              examples.push(trimmed);
            }
          }
        }
      }
    }
  }
  return examples.length > 0 ? examples : undefined;
}

function simplifyType(typeStr: string): string {
  // Clean up multi-line type strings into single-line
  return typeStr
    .replace(/\/\*\*[\s\S]*?\*\//g, "") // remove inline JSDoc
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

// Walk the AST to find class declarations
ts.forEachChild(sourceFile, (node) => {
  if (!ts.isClassDeclaration(node) || !node.name) return;

  const className = node.name.text;
  const moduleName = classToModule.get(className);
  if (!moduleName) return;

  const validMethods = new Set(listMethods(faker, moduleName));

  for (const member of node.members) {
    if (!ts.isMethodDeclaration(member) || !member.name) continue;
    const methodName = (member.name as ts.Identifier).text;

    if (!validMethods.has(methodName)) continue;

    const params: ParamInfo[] = [];
    for (const param of member.parameters) {
      const name = (param.name as ts.Identifier).text;
      const optional = !!param.questionToken || !!param.initializer;
      const typeStr = param.type
        ? simplifyType(getTypeString(param.type))
        : "unknown";
      params.push({ name, type: typeStr, optional });
    }

    const returnType = member.type
      ? simplifyType(getTypeString(member.type))
      : "unknown";

    const description = getJsDocDescription(member);
    const examples = getJsDocExamples(member);

    const key = `${moduleName}.${methodName}`;

    // Only store first overload (most general)
    if (!metadata[key]) {
      metadata[key] = {
        params,
        returnType,
        ...(description && { description }),
        ...(examples && { examples }),
      };
    }
  }
});

// Summary
const methodCount = Object.keys(metadata).length;
const withExamples = Object.values(metadata).filter((m) => m.examples).length;
console.log(
  `Generated metadata for ${methodCount} methods (${withExamples} with examples)`
);

const outPath = join(process.cwd(), "src/metadata.json");
writeFileSync(outPath, JSON.stringify(metadata, null, 2) + "\n");
console.log(`Wrote: src/metadata.json`);
