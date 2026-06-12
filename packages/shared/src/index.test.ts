import { describe, expect, it } from "vitest";
import { appendMessage, createCsvReport, dashboardSummary, moveLeadStage } from "./index";

describe("Qchart shared contracts", () => {
  it("exposes dashboard metrics", () => {
    expect(dashboardSummary.metrics.map((metric) => metric.label)).toContain("Leads Won");
  });

  it("moves a lead between stages", () => {
    expect(moveLeadStage("lead_sarah", "qualified").stage).toBe("qualified");
  });

  it("appends outbound messages", () => {
    expect(appendMessage("conv_sarah", "Sending the proposal now.").messages.at(-1)?.direction).toBe("outbound");
  });

  it("exports CSV reports", () => {
    expect(createCsvReport()).toContain("Conversion Rate,24%");
  });
});
