import http from "node:http";
import { analyticsSummary, appendMessage, channels, conversations, createCsvReport, dashboardSummary, leads, moveLeadStage, profile, workspace } from "@qchart/shared";
import { verifyGatewayToken } from "./auth";

const port = Number(process.env.GATEWAY_PORT ?? 4100);

async function fetchService<T>(url: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      if (res.headers.get("content-type")?.includes("text/csv")) {
        return (await res.text()) as unknown as T;
      }
      return (await res.json()) as T;
    }
  } catch (error) {
    console.warn(`Gateway warning: Microservice at ${url} is offline or timed out. Falling back to shared module data.`);
  }
  return fallback;
}

function send(res: http.ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Access-Control-Allow-Origin": process.env.WEB_ORIGIN ?? "http://localhost:3001",
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
    
    if (req.method === "GET" && url.pathname === "/me") {
      return send(res, 200, { profile, workspace });
    }
    
    if (req.method === "GET" && url.pathname === "/dashboard/summary") {
      return send(res, 200, dashboardSummary, { ETag: "\"dashboard-v1\"", "Cache-Control": "private, max-age=20, stale-while-revalidate=120" });
    }
    
    if (req.method === "GET" && url.pathname === "/conversations") {
      const data = await fetchService(`http://localhost:${process.env.CONVERSATIONS_PORT ?? 4101}/`, conversations);
      return send(res, 200, data);
    }
    
    if (req.method === "POST" && url.pathname === "/messages") {
      const body = await readJson(req);
      // Delegate to conversations microservice if needed, or update locally
      const updated = appendMessage(String(body.conversationId), String(body.body));
      return send(res, 201, updated);
    }
    
    if (req.method === "GET" && url.pathname === "/leads") {
      return send(res, 200, leads);
    }
    
    if (req.method === "PATCH" && url.pathname.startsWith("/leads/")) {
      const body = await readJson(req);
      const leadId = String(url.pathname.split("/").at(-1));
      return send(res, 200, moveLeadStage(leadId, String(body.stage) as never));
    }
    
    if (req.method === "GET" && url.pathname.startsWith("/analytics")) {
      const analyticsPort = process.env.ANALYTICS_PORT ?? 4102;
      const data = await fetchService(`http://localhost:${analyticsPort}/`, analyticsSummary);
      return send(res, 200, data, { ETag: "\"analytics-v1\"", "Cache-Control": "private, max-age=30, stale-while-revalidate=180" });
    }
    
    if (req.method === "POST" && url.pathname === "/reports/export") {
      const reportsPort = process.env.REPORTS_PORT ?? 4103;
      const csvData = await fetchService(`http://localhost:${reportsPort}/`, createCsvReport());
      return send(res, 200, csvData, { 
        "Content-Type": "text/csv; charset=utf-8", 
        "Content-Disposition": "attachment; filename=qchart-report.csv" 
      });
    }
    
    if (req.method === "GET" && url.pathname === "/channels") {
      const syncPort = process.env.SYNC_PORT ?? 4104;
      const syncData = await fetchService<{ channel: string; queuedEvents: number }[]>(`http://localhost:${syncPort}/`, []);
      
      const updatedChannels = channels.map(c => {
        const syncItem = syncData.find(s => s.channel === c.kind);
        return syncItem ? { ...c, unreadCount: syncItem.queuedEvents } : c;
      });
      return send(res, 200, updatedChannels);
    }
    
    return send(res, 404, { error: "Not found" });
  } catch (error) {
    const status = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 500;
    return send(res, status, { error: error instanceof Error ? error.message : "Unknown error" });
  }
}).listen(port, () => console.log(`Qchart gateway listening on http://localhost:${port}`));

