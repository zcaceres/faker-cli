import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { invoke } from "../src/resolver";
import { listMethods } from "../src/enumerate";

describe("helpers module", () => {
  beforeEach(() => {
    faker.seed(42);
  });

  it("arrayElement picks from a JSON array", () => {
    const result = invoke(faker, "helpers.arrayElement", '["cat","dog","mouse"]');
    expect(["cat", "dog", "mouse"]).toContain(result);
  });

  it("fake resolves template strings", () => {
    const result = invoke(faker, "helpers.fake", "{{person.firstName}}") as string;
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("fromRegExp generates matching strings", () => {
    const result = invoke(faker, "helpers.fromRegExp", "[A-Z]{5}") as string;
    expect(result).toMatch(/^[A-Z]{5}$/);
  });

  it("slugify converts string to slug", () => {
    const result = invoke(faker, "helpers.slugify", "Hello World");
    expect(result).toBe("Hello-World");
  });

  it("shuffle returns shuffled array", () => {
    const result = invoke(faker, "helpers.shuffle", '[1,2,3,4,5]') as number[];
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("objectKey returns a key from JSON object", () => {
    const result = invoke(faker, "helpers.objectKey", '{"a":1,"b":2,"c":3}');
    expect(["a", "b", "c"]).toContain(result);
  });

  it("excludes callback-requiring methods", () => {
    const methods = listMethods(faker, "helpers");
    expect(methods).not.toContain("unique");
    expect(methods).not.toContain("maybe");
    expect(methods).not.toContain("multiple");
  });

  it("includes CLI-compatible methods", () => {
    const methods = listMethods(faker, "helpers");
    expect(methods).toContain("arrayElement");
    expect(methods).toContain("fake");
    expect(methods).toContain("fromRegExp");
    expect(methods).toContain("slugify");
    expect(methods).toContain("shuffle");
  });
});
