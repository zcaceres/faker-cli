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
});
