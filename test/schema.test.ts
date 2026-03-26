import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { resolveSchema } from "../src/schema";

describe("resolveSchema", () => {
  beforeEach(() => {
    faker.seed(42);
  });

  it("resolves flat object with faker methods", () => {
    const result = resolveSchema(faker, {
      name: "person.fullName",
      email: "internet.email",
    }) as any;

    expect(typeof result.name).toBe("string");
    expect(typeof result.email).toBe("string");
    expect(result.email).toContain("@");
  });

  it("resolves nested objects", () => {
    const result = resolveSchema(faker, {
      user: {
        name: "person.fullName",
        address: {
          city: "location.city",
          zip: "location.zipCode",
        },
      },
    }) as any;

    expect(typeof result.user.name).toBe("string");
    expect(typeof result.user.address.city).toBe("string");
    expect(typeof result.user.address.zip).toBe("string");
  });

  it("resolves methods with parenthesized args", () => {
    const result = resolveSchema(faker, {
      age: 'number.int({"min":18,"max":65})',
    }) as any;

    expect(typeof result.age).toBe("number");
    expect(result.age).toBeGreaterThanOrEqual(18);
    expect(result.age).toBeLessThanOrEqual(65);
  });

  it("passes through literal strings", () => {
    const result = resolveSchema(faker, {
      type: "employee",
      name: "person.fullName",
    }) as any;

    expect(result.type).toBe("employee");
    expect(typeof result.name).toBe("string");
    expect(result.name).not.toBe("person.fullName");
  });

  it("passes through numbers, booleans, and null", () => {
    const result = resolveSchema(faker, {
      count: 42,
      active: true,
      deleted: null,
    }) as any;

    expect(result.count).toBe(42);
    expect(result.active).toBe(true);
    expect(result.deleted).toBe(null);
  });

  it("passes through unknown module.method as literal", () => {
    const result = resolveSchema(faker, {
      label: "hello.world",
    }) as any;

    expect(result.label).toBe("hello.world");
  });

  it("resolves arrays in schema", () => {
    const result = resolveSchema(faker, {
      tags: ["word.noun", "word.adjective"],
    }) as any;

    expect(Array.isArray(result.tags)).toBe(true);
    expect(result.tags.length).toBe(2);
    expect(typeof result.tags[0]).toBe("string");
    expect(typeof result.tags[1]).toBe("string");
  });

  it("is deterministic with seed", () => {
    faker.seed(42);
    const a = resolveSchema(faker, {
      name: "person.fullName",
      email: "internet.email",
    });

    faker.seed(42);
    const b = resolveSchema(faker, {
      name: "person.fullName",
      email: "internet.email",
    });

    expect(a).toEqual(b);
  });

  it("handles bare string schema (single method)", () => {
    const result = resolveSchema(faker, "person.fullName");
    expect(typeof result).toBe("string");
  });

  it("handles method returning object", () => {
    const result = resolveSchema(faker, {
      airline: "airline.airline",
    }) as any;

    expect(result.airline).toHaveProperty("name");
    expect(result.airline).toHaveProperty("iataCode");
  });

  it("handles method returning number", () => {
    const result = resolveSchema(faker, {
      status: "internet.httpStatusCode",
    }) as any;

    expect(typeof result.status).toBe("number");
  });

  it("treats malformed parens (no closing) as literal string", () => {
    const result = resolveSchema(faker, {
      x: "number.int(5",
    }) as any;

    expect(result.x).toBe("number.int(5");
  });

  it("handles bigint in schema without crashing", () => {
    const result = resolveSchema(faker, {
      val: "number.bigInt",
    }) as any;

    expect(typeof result.val).toBe("bigint");
  });
});
