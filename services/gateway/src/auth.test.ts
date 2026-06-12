import { describe, expect, it } from "vitest";
import { readBearerToken, verifyGatewayToken } from "./auth";

describe("gateway auth", () => {
  it("extracts bearer tokens", () => {
    expect(readBearerToken("Bearer dev-token")).toBe("dev-token");
  });

  it("accepts local development token", () => {
    expect(verifyGatewayToken("Bearer dev-token").userId).toBe("profile_alex");
  });

  it("rejects missing tokens", () => {
    expect(() => verifyGatewayToken(undefined)).toThrow("Missing bearer token");
  });
});
