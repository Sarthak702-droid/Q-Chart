import http from "node:http";
import { conversations } from "@qchart/shared";
http.createServer((_, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(conversations)); }).listen(Number(process.env.CONVERSATIONS_PORT ?? 4101));
