import { describe, it, expect, beforeEach } from "bun:test";
import { invoke, setSeed } from "../src/resolver";

describe("invoke", () => {
  beforeEach(() => {
    setSeed(99999);
  });

  it("resolves module.method and returns a value", () => {
    const result = invoke("person.firstName");
    expect(typeof result).toBe("string");
    expect((result as string).length).toBeGreaterThan(0);
  });

  it("passes parsed JSON options to the method", () => {
    const result = invoke("number.int", '{"min":1,"max":10}');
    expect(typeof result).toBe("number");
    expect(result as number).toBeGreaterThanOrEqual(1);
    expect(result as number).toBeLessThanOrEqual(10);
  });

  it("passes bare string argument", () => {
    const result = invoke("person.firstName", "female");
    expect(typeof result).toBe("string");
  });

  it("returns objects for object-returning methods", () => {
    const result = invoke("airline.airline") as any;
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("iataCode");
  });

  it("returns Date for date methods", () => {
    const result = invoke("date.past");
    expect(result).toBeInstanceOf(Date);
  });

  it("returns bigint for number.bigInt", () => {
    const result = invoke("number.bigInt");
    expect(typeof result).toBe("bigint");
  });

  it("throws on invalid path format", () => {
    expect(() => invoke("person")).toThrow("Expected format: module.method");
  });

  it("throws on unknown module", () => {
    expect(() => invoke("fake.method")).toThrow('Unknown module "fake"');
  });

  it("throws on unknown method", () => {
    expect(() => invoke("person.notAMethod")).toThrow(
      'Unknown method "person.notAMethod"'
    );
  });
});
