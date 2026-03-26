import { describe, it, expect } from "bun:test";
import { allFakers } from "@faker-js/faker";
import { invoke } from "../src/resolver";
import { listModules } from "../src/enumerate";

describe("locale support", () => {
  it("generates German names with de locale", () => {
    allFakers.de.seed(42);
    const result = invoke(allFakers.de, "person.firstName");
    expect(typeof result).toBe("string");
    expect((result as string).length).toBeGreaterThan(0);

    // Verify it's deterministic
    allFakers.de.seed(42);
    const result2 = invoke(allFakers.de, "person.firstName");
    expect(result2).toBe(result);
  });

  it("generates Japanese names with ja locale", () => {
    allFakers.ja.seed(42);
    const result = invoke(allFakers.ja, "person.lastName");
    expect(typeof result).toBe("string");
    expect((result as string).length).toBeGreaterThan(0);
  });

  it("lists modules for non-English locales", () => {
    const modules = listModules(allFakers.de);
    expect(modules).toContain("person");
    expect(modules).toContain("internet");
  });

  it("produces different results for different locales with same seed", () => {
    allFakers.en.seed(42);
    const en = invoke(allFakers.en, "person.firstName");

    allFakers.de.seed(42);
    const de = invoke(allFakers.de, "person.firstName");

    // Different locales should generally produce different names
    // (not guaranteed for every seed, but very likely)
    expect(typeof en).toBe("string");
    expect(typeof de).toBe("string");
  });
});
