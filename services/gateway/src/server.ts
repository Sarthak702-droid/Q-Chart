import http from "node:http";
import { analyticsSummary, appendMessage, channels, conversations, createCsvReport, dashboardSummary, leads, moveLeadStage, profile, workspace } from "@qchart/shared";
import { verifyGatewayToken } from "./auth";

const port = Number(process.env.GATEWAY_PORT ?? 4100);

function send(res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Access-Control-Allow-Origin": process.env.WEB_ORIGIN ?? "http://localhost:3000",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Content-Type": typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    ...headers
  });
  res.end(payload);
}

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown> : {};
}

http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/health") return send(res, 200, { status: "ok", service: "qchart-gateway" });
  try {
    verifyGatewayToken(req.headers.authorization);
    if (req.method === "GET" && url.pathname === "/me") return send(res, 200, { profile, workspace });
    if (req.method === "GET" && url.pathname === "/dashboard/summary") return send(res, 200, dashboardSummary, { ETag: "\"dashboard-v1\"", "Cache-Control": "private, max-age=20, stale-while-revalidate=120" });
    if (req.method === "GET" && url.pathname === "/conversations") return send(res, 200, conversations);
    if (req.method === "POST" && url.pathname === "/messages") {
      const body = await readJson(req);
      return send(res, 201, appendMessage(String(body.conversationId), String(body.body)));
    }
    if (req.method === "GET" && url.pathname === "/leads") return send(res, 200, leads);
    if (req.method === "PATCH" && url.pathname.startsWith("/leads/")) {
      const body = await readJson(req);
      return send(res, 200, moveLeadStage(String(url.pathname.split("/").at(-1)), String(body.stage) as never));
    }
    if (req.method === "GET" && url.pathname.startsWith("/analytics")) return send(res, 200, analyticsSummary, { ETag: "\"analytics-v1\"", "Cache-Control": "private, max-age=30, stale-while-revalidate=180" });
    if (req.method === "POST" && url.pathname === "/reports/export") return send(res, 200, createCsvReport(), { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=qchart-report.csv" });
    if (req.method === "GET" && url.pathname === "/channels") return send(res, 200, channels);
    return send(res, 404, { error: "Not found" });
  } catch (error) {
    const status = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 500;
    return send(res, status, { error: error instanceof Error ? error.message : "Unknown error" });
  }
}).listen(port, () => console.log(`Qchart gateway listening on http://localhost:${port}`));
