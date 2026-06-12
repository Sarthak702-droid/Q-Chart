import { describe, expect, it } from "vitest";
import { dashboardSummary } from "@qchart/shared";

describe("dashboard content", () => {
  it("contains the MVP personal analytics cards", () => {
    expect(dashboardSummary.metrics.map((metric) => metric.label)).toEqual(
      expect.arrayContaining(["Leads Won", "Response Time", "Conversion Rate", "Team Performance"])
    );
  });
});
