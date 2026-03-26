import { describe, it, expect } from "bun:test";
import { serialize } from "../src/serialize";

describe("serialize", () => {
  it("serializes strings as JSON strings", () => {
    expect(serialize("hello")).toBe('"hello"');
  });

  it("serializes numbers as bare JSON numbers", () => {
    expect(serialize(42)).toBe("42");
    expect(serialize(3.14)).toBe("3.14");
  });

  it("serializes booleans", () => {
    expect(serialize(true)).toBe("true");
    expect(serialize(false)).toBe("false");
  });

  it("serializes bigint as string", () => {
    expect(serialize(BigInt("312559676790126"))).toBe('"312559676790126"');
  });

  it("serializes Date as ISO string", () => {
    const d = new Date("2027-02-03T04:31:30.579Z");
    expect(serialize(d)).toBe('"2027-02-03T04:31:30.579Z"');
  });

  it("serializes Date[] as array of ISO strings", () => {
    const dates = [
      new Date("2023-01-01T00:00:00Z"),
      new Date("2024-06-15T12:00:00Z"),
    ];
    expect(serialize(dates)).toBe(
      '["2023-01-01T00:00:00.000Z","2024-06-15T12:00:00.000Z"]'
    );
  });

  it("serializes number[] as JSON array", () => {
    expect(serialize([0.93, 0.31, 0.18, 0.2])).toBe("[0.93,0.31,0.18,0.2]");
  });

  it("serializes plain objects as JSON", () => {
    const obj = { name: "Vietnam Airlines", iataCode: "VN" };
    expect(serialize(obj)).toBe('{"name":"Vietnam Airlines","iataCode":"VN"}');
  });

  it("serializes null", () => {
    expect(serialize(null)).toBe("null");
  });

  it("serializes bigint nested inside objects", () => {
    expect(serialize({ val: BigInt("123456") })).toBe('{"val":"123456"}');
  });

  it("serializes Date nested inside objects", () => {
    const d = new Date("2025-01-01T00:00:00.000Z");
    expect(serialize({ d })).toBe('{"d":"2025-01-01T00:00:00.000Z"}');
  });

  it("serializes deeply nested mixed types", () => {
    const val = {
      user: {
        born: new Date("2000-06-15T00:00:00.000Z"),
        id: BigInt("999"),
      },
      tags: ["a", "b"],
      active: true,
    };
    expect(serialize(val)).toBe(
      '{"user":{"born":"2000-06-15T00:00:00.000Z","id":"999"},"tags":["a","b"],"active":true}'
    );
  });

  it("serializes array of objects with special types", () => {
    const arr = [
      { d: new Date("2025-01-01T00:00:00.000Z"), n: BigInt("42") },
      { d: new Date("2026-01-01T00:00:00.000Z"), n: BigInt("99") },
    ];
    expect(serialize(arr)).toBe(
      '[{"d":"2025-01-01T00:00:00.000Z","n":"42"},{"d":"2026-01-01T00:00:00.000Z","n":"99"}]'
    );
  });
});
