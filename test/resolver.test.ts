import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { invoke } from "../src/resolver";

describe("invoke", () => {
  beforeEach(() => {
    faker.seed(99999);
  });

  it("resolves module.method and returns a value", () => {
    const result = invoke(faker, "person.firstName");
    expect(typeof result).toBe("string");
    expect((result as string).length).toBeGreaterThan(0);
  });

  it("passes parsed JSON options to the method", () => {
    const result = invoke(faker, "number.int", '{"min":1,"max":10}');
    expect(typeof result).toBe("number");
    expect(result as number).toBeGreaterThanOrEqual(1);
    expect(result as number).toBeLessThanOrEqual(10);
  });

  it("passes bare string argument", () => {
    const result = invoke(faker, "person.firstName", "female");
    expect(typeof result).toBe("string");
  });

  it("returns objects for object-returning methods", () => {
    const result = invoke(faker, "airline.airline") as any;
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("iataCode");
  });

  it("returns Date for date methods", () => {
    const result = invoke(faker, "date.past");
    expect(result).toBeInstanceOf(Date);
  });

  it("returns bigint for number.bigInt", () => {
    const result = invoke(faker, "number.bigInt");
    expect(typeof result).toBe("bigint");
  });

  it("throws on invalid path format", () => {
    expect(() => invoke(faker, "person")).toThrow(
      "Expected format: module.method"
    );
  });

  it("throws on unknown module", () => {
    expect(() => invoke(faker, "fake.method")).toThrow(
      'Unknown module "fake"'
    );
  });

  it("throws on unknown method", () => {
    expect(() => invoke(faker, "person.notAMethod")).toThrow(
      'Unknown method "person.notAMethod"'
    );
  });
});
