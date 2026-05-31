/**
 * Vercel Serverless Function — ARRE Express Backend
 *
 * Vercel auto-detects files in /api and serves them as serverless functions.
 * The rewrite in vercel.json routes all /api/* requests to this handler.
 *
 * This file is a self-contained Express app adapted for serverless:
 * - No app.listen() call (Vercel handles the HTTP layer)
 * - In-memory stores instead of filesystem (no writable disk in serverless)
 */

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { basename } from "path";

const app: Express = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health ──────────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", env: process.env.NODE_ENV ?? "production" });
});

// ── Anchors (in-memory) ─────────────────────────────────────────────────────
interface Anchor {
  id: string;
  name: string;
  modelData: string | null;
  createdAt: string;
  [key: string]: unknown;
}

const anchorsMap = new Map<string, Anchor>();

app.get("/api/anchors", (_req: Request, res: Response) => {
  res.json(Array.from(anchorsMap.values()));
});

app.post("/api/anchors", (req: Request, res: Response) => {
  const body = req.body as { name?: unknown; modelData?: unknown };
  if (!body.name || typeof body.name !== "string") {
    res.status(400).json({ error: "Campo 'name' requerido" });
    return;
  }
  const anchor: Anchor = {
    id: randomUUID(),
    name: body.name,
    modelData: typeof body.modelData === "string" ? body.modelData : null,
    createdAt: new Date().toISOString(),
  };
  anchorsMap.set(anchor.id, anchor);
  res.status(201).json(anchor);
});

app.get("/api/anchors/:id", (req: Request, res: Response) => {
  const anchor = anchorsMap.get(req.params.id);
  if (!anchor) {
    res.status(404).json({ error: "Anclaje no encontrado" });
    return;
  }
  res.json(anchor);
});

app.delete("/api/anchors/:id", (req: Request, res: Response) => {
  if (!anchorsMap.has(req.params.id)) {
    res.status(404).json({ error: "Anclaje no encontrado" });
    return;
  }
  anchorsMap.delete(req.params.id);
  res.json({ success: true, message: "Anclaje eliminado" });
});

// ── Exports (in-memory, base64) ─────────────────────────────────────────────
const exportsMap = new Map<string, Buffer>();

app.post("/api/export", (req: Request, res: Response) => {
  const body = req.body as { filename?: unknown; data?: unknown };
  if (!body.filename || typeof body.filename !== "string" || !body.data || typeof body.data !== "string") {
    res.status(400).json({ error: "Campos 'filename' y 'data' (base64) requeridos" });
    return;
  }
  const safeFilename = basename(body.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = Buffer.from(body.data, "base64");
  exportsMap.set(safeFilename, buffer);
  res.status(201).json({ filename: safeFilename, url: `/api/export/${safeFilename}` });
});

app.get("/api/export/:filename", (req: Request, res: Response) => {
  const safeFilename = basename(req.params.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = exportsMap.get(safeFilename);
  if (!buffer) {
    res.status(404).json({ error: "Archivo no encontrado (puede haber expirado)" });
    return;
  }
  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(buffer);
});

// Export for Vercel serverless (no app.listen)
export default app;
