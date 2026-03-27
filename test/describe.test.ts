import { describe as bunDescribe, it, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import {
  describe,
  getModuleDescription,
  formatMethodDescription,
  getMethodInfo,
} from "../src/describe";

bunDescribe("describe", () => {
  bunDescribe("module-level", () => {
    it("describes a module with all its methods", () => {
      const output = describe(faker, "person");
      expect(output).toContain("person");
      expect(output).toContain("firstName");
      expect(output).toContain("fullName");
      expect(output).toContain("methods");
      expect(output).toContain("faker --describe person.");
    });

    it("throws guided error for unknown module", () => {
      expect(() => describe(faker, "fakemod")).toThrow("faker --list");
    });
  });

  bunDescribe("method-level", () => {
    it("describes a method with params and examples", () => {
      const output = describe(faker, "number.int");
      expect(output).toContain("number.int(options?)");
      expect(output).toContain("Returns: number");
      expect(output).toContain("Examples:");
    });

    it("shows CLI-syntax examples", () => {
      const output = describe(faker, "number.int");
      // Should NOT contain JS-style "faker.number.int("
      // Should contain CLI-style "faker number.int"
      expect(output).toContain("faker number.int");
    });

    it("throws guided error for unknown method", () => {
      expect(() => describe(faker, "person.foobar")).toThrow(
        "faker --describe person"
      );
    });

    it("throws guided error for unknown module in dotted path", () => {
      expect(() => describe(faker, "fakemod.something")).toThrow(
        "faker --list"
      );
    });
  });

  bunDescribe("module descriptions", () => {
    it("returns description for known modules", () => {
      expect(getModuleDescription("person")).toContain("Names");
      expect(getModuleDescription("number")).toContain("int");
      expect(getModuleDescription("internet")).toContain("Email");
    });

    it("returns empty string for unknown module", () => {
      expect(getModuleDescription("nonexistent")).toBe("");
    });
  });

  bunDescribe("CLI example transformation", () => {
    it("transforms examples in method description", () => {
      const info = getMethodInfo("person.firstName");
      if (!info) throw new Error("no metadata");
      const output = formatMethodDescription("person.firstName", info);
      // Should contain CLI-style, not JS-style
      expect(output).not.toContain("faker.person.firstName(");
      expect(output).toContain("faker person.firstName");
    });
  });
});
