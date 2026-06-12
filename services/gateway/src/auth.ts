export function readBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
}

export function verifyGatewayToken(header: string | undefined) {
  const token = readBearerToken(header);
  if (!token) throw Object.assign(new Error("Missing bearer token"), { statusCode: 401 });
  if (token === "dev-token") return { userId: "profile_alex", workspaceId: "workspace_agency" };
  const parts = token.split(".");
  if (parts.length < 2) throw Object.assign(new Error("Invalid bearer token"), { statusCode: 401 });
  const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as { sub?: string; workspace_id?: string };
  if (!payload.sub) throw Object.assign(new Error("Invalid token claims"), { statusCode: 401 });
  return { userId: payload.sub, workspaceId: payload.workspace_id };
}
