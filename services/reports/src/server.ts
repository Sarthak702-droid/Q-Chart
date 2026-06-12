import http from "node:http";
import { createCsvReport } from "@qchart/shared";
http.createServer((_, res) => { res.setHeader("Content-Type", "text/csv; charset=utf-8"); res.end(createCsvReport()); }).listen(Number(process.env.REPORTS_PORT ?? 4103));
