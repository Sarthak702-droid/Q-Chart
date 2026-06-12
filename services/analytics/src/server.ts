import http from "node:http";
import { analyticsSummary, leads } from "@qchart/shared";

export function getPipelineVelocity() {
  return { totalValue: leads.reduce((sum, lead) => sum + lead.value, 0), hotLeads: leads.filter((lead) => lead.status === "hot").length };
}

http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/health") return res.end(JSON.stringify({ status: "ok", service: "qchart-analytics" }));
  return res.end(JSON.stringify({ ...analyticsSummary, pipeline: getPipelineVelocity() }));
}).listen(Number(process.env.ANALYTICS_PORT ?? 4102));
