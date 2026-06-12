import http from "node:http";
import { channels } from "@qchart/shared";
http.createServer((_, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(channels.map((channel) => ({ channel: channel.kind, queuedEvents: channel.unreadCount })))); }).listen(Number(process.env.SYNC_PORT ?? 4104));
