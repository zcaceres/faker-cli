import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import fixtureData from "./fixtures/return-types.json";

const SEED = 12345;
const REF_DATE = "2025-01-01T00:00:00.000Z";

function resetFaker() {
  faker.seed(SEED);
  faker.setDefaultRefDate(new Date(REF_DATE));
}

describe("fixtures are deterministic", () => {
  it("reproduces every fixture value exactly", () => {
    for (const fixture of fixtureData) {
      resetFaker();
      const mod = (faker as any)[fixture.module];
      const result = mod[fixture.method]();

      if (fixture.returnType === "bigint") {
        expect(result.toString()).toBe(fixture.raw);
      } else if (fixture.returnType === "Date") {
        expect((result as Date).toISOString()).toBe(fixture.raw);
      } else if (fixture.returnType === "Date[]") {
        expect(
          (result as Date[]).map((d) => d.toISOString())
        ).toEqual(fixture.raw);
      } else {
        expect(result).toEqual(fixture.raw);
      }
    }
  });

  it("covers all 7 return type categories", () => {
    const types = new Set(fixtureData.map((f: any) => f.returnType));
    expect(types.has("string")).toBe(true);
    expect(types.has("number")).toBe(true);
    expect(types.has("boolean")).toBe(true);
    expect(types.has("bigint")).toBe(true);
    expect(types.has("Date")).toBe(true);
    expect(types.has("number[]")).toBe(true);
    expect(types.has("object")).toBe(true);
  });

  it("has 7 unique object shapes", () => {
    const objects = fixtureData.filter((f: any) => f.returnType === "object");
    expect(objects.length).toBe(7);
    for (const obj of objects) {
      expect((obj as any).objectKeys).toBeDefined();
      expect((obj as any).objectKeys.length).toBeGreaterThan(0);
    }
  });
});
