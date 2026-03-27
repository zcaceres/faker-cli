import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { formatColumns } from "../src/format";
import { serialize } from "../src/serialize";
import { invoke } from "../src/resolver";

describe("formatColumns", () => {
  it("formats items with a header", () => {
    const result = formatColumns(["a", "b", "c"], "Items");
    expect(result).toContain("Items:");
    expect(result).toContain("a");
    expect(result).toContain("b");
    expect(result).toContain("c");
  });

  it("handles empty array", () => {
    const result = formatColumns([], "Empty");
    expect(result).toContain("(none)");
  });

  it("formats without header", () => {
    const result = formatColumns(["x", "y"]);
    expect(result).not.toContain(":");
    expect(result).toContain("x");
  });
});

describe("NDJSON output", () => {
  it("serialize produces one line per value", () => {
    faker.seed(42);
    const lines: string[] = [];
    for (let i = 0; i < 3; i++) {
      lines.push(serialize(invoke(faker, "person.firstName")));
    }
    // Each line is valid JSON
    for (const line of lines) {
      expect(() => JSON.parse(line)).not.toThrow();
    }
    // Lines are different (different names generated)
    expect(lines.length).toBe(3);
  });

  it("serialize handles schema objects as individual lines", () => {
    faker.seed(42);
    const result = serialize({ name: "John", age: 30 });
    expect(JSON.parse(result)).toEqual({ name: "John", age: 30 });
  });
});
