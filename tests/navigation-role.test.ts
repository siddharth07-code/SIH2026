import { describe, it, expect } from "vitest";
import { getNavigationForRole, navigationConfig } from "@/config/navigation";

describe("Role-Aware Navigation", () => {
  it("should return basic operational items when role is null / unauthenticated", () => {
    const nav = getNavigationForRole(null);
    const allHrefs = nav.flatMap((s) => s.items.map((i) => i.href));

    expect(allHrefs).toContain("/dashboard");
    expect(allHrefs).toContain("/verifications");
    expect(allHrefs).not.toContain("/settings");
    expect(allHrefs).not.toContain("/audit");
  });

  it("should filter navigation correctly for OFFICER role", () => {
    const nav = getNavigationForRole("OFFICER");
    const allHrefs = nav.flatMap((s) => s.items.map((i) => i.href));

    expect(allHrefs).toContain("/dashboard");
    expect(allHrefs).toContain("/verifications");
    expect(allHrefs).not.toContain("/audit");
    expect(allHrefs).not.toContain("/officers");
    expect(allHrefs).not.toContain("/settings");
  });

  it("should include audit and officers for SUPERVISOR role", () => {
    const nav = getNavigationForRole("SUPERVISOR");
    const allHrefs = nav.flatMap((s) => s.items.map((i) => i.href));

    expect(allHrefs).toContain("/dashboard");
    expect(allHrefs).toContain("/verifications");
    expect(allHrefs).toContain("/audit");
    expect(allHrefs).toContain("/officers");
    expect(allHrefs).not.toContain("/settings");
  });

  it("should include all sections including settings for ADMINISTRATOR role", () => {
    const nav = getNavigationForRole("ADMINISTRATOR");
    const allHrefs = nav.flatMap((s) => s.items.map((i) => i.href));

    expect(allHrefs).toContain("/dashboard");
    expect(allHrefs).toContain("/verifications");
    expect(allHrefs).toContain("/audit");
    expect(allHrefs).toContain("/officers");
    expect(allHrefs).toContain("/settings");
  });
});
