import { describe, it, expect } from "bun:test";
import { serializeCSV } from "../src/serialize";

describe("serializeCSV", () => {
  describe("object rows", () => {
    it("produces header row from object keys", () => {
      const csv = serializeCSV([
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]);
      const lines = csv.split("\n");
      expect(lines[0]).toBe("name,age");
      expect(lines[1]).toBe("Alice,30");
      expect(lines[2]).toBe("Bob,25");
    });

    it("escapes values containing commas", () => {
      const csv = serializeCSV([{ bio: "traveler, philosopher" }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe('"traveler, philosopher"');
    });

    it("escapes values containing double quotes", () => {
      const csv = serializeCSV([{ quote: 'He said "hello"' }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe('"He said ""hello"""');
    });

    it("escapes values containing newlines", () => {
      const csv = serializeCSV([{ text: "line1\nline2" }]);
      const lines = csv.split("\n");
      // The escaped value wraps the whole thing in quotes
      expect(csv).toContain('"line1\nline2"');
    });

    it("handles Date values as ISO strings", () => {
      const csv = serializeCSV([
        { d: new Date("2025-01-01T00:00:00.000Z") },
      ]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe("2025-01-01T00:00:00.000Z");
    });

    it("handles BigInt values as strings", () => {
      const csv = serializeCSV([{ val: BigInt("123456") }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe("123456");
    });

    it("handles null and undefined as empty", () => {
      const csv = serializeCSV([{ a: null, b: undefined }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe(",");
    });

    it("handles boolean values", () => {
      const csv = serializeCSV([{ active: true, deleted: false }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe("true,false");
    });

    it("uses first row keys for all rows", () => {
      const csv = serializeCSV([
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ]);
      expect(csv).toBe("a,b\n1,2\n3,4");
    });
  });

  describe("scalar rows", () => {
    it("outputs one value per line with no header", () => {
      const csv = serializeCSV(["Alice", "Bob", "Charlie"]);
      expect(csv).toBe("Alice\nBob\nCharlie");
    });

    it("escapes scalar values containing commas", () => {
      const csv = serializeCSV(["hello, world", "plain"]);
      expect(csv).toBe('"hello, world"\nplain');
    });

    it("handles numeric scalars", () => {
      const csv = serializeCSV([42, 99, 7]);
      expect(csv).toBe("42\n99\n7");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for empty array", () => {
      expect(serializeCSV([])).toBe("");
    });

    it("serializes nested objects as JSON in cells", () => {
      const csv = serializeCSV([
        { name: "Alice", address: { city: "NYC", zip: "10001" } },
      ]);
      const lines = csv.split("\n");
      expect(lines[0]).toBe("name,address");
      expect(lines[1]).toContain("Alice");
      expect(lines[1]).toContain("NYC");
      expect(lines[1]).not.toContain("[object Object]");
    });

    it("escapes header keys containing commas", () => {
      const csv = serializeCSV([{ "first,name": "Alice" }]);
      const lines = csv.split("\n");
      expect(lines[0]).toBe('"first,name"');
      expect(lines[1]).toBe("Alice");
    });

    it("escapes header keys containing quotes", () => {
      const csv = serializeCSV([{ 'say "hi"': "Alice" }]);
      const lines = csv.split("\n");
      expect(lines[0]).toBe('"say ""hi"""');
    });

    it("serializes array values as JSON in cells", () => {
      const csv = serializeCSV([{ colors: [1, 2, 3] }]);
      const lines = csv.split("\n");
      expect(lines[1]).toBe('"[1,2,3]"');
    });
  });
});
