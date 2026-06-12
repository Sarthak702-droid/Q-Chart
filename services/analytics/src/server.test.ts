import { describe, expect, it } from "vitest";
import { getPipelineVelocity } from "./server";

describe("analytics service", () => {
  it("aggregates pipeline value", () => {
    expect(getPipelineVelocity().totalValue).toBeGreaterThan(0);
  });
});
