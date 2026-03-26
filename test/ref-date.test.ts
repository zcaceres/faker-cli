import { describe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import { invoke } from "../src/resolver";
import fixtureData from "./fixtures/return-types.json";

const SEED = 12345;
const REF_DATE = "2025-01-01T00:00:00.000Z";

describe("ref-date", () => {
  it("produces deterministic dates with seed + ref-date", () => {
    faker.seed(SEED);
    faker.setDefaultRefDate(new Date(REF_DATE));
    const a = invoke(faker, "date.past") as Date;

    faker.seed(SEED);
    faker.setDefaultRefDate(new Date(REF_DATE));
    const b = invoke(faker, "date.past") as Date;

    expect(a.toISOString()).toBe(b.toISOString());
  });

  it("matches fixture values with same seed + ref-date", () => {
    const dateFixtures = fixtureData.filter(
      (f: any) => f.returnType === "Date"
    );

    for (const fixture of dateFixtures) {
      faker.seed(SEED);
      faker.setDefaultRefDate(new Date(REF_DATE));
      const result = invoke(faker, `${fixture.module}.${fixture.method}`);

      expect((result as Date).toISOString()).toBe(fixture.raw);
    }
  });
});
