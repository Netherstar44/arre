/**
 * Vercel Serverless Function — ARRE Express Backend
 *
 * Vercel auto-detects files in /api and serves them as serverless functions.
 * This file is a self-contained Express app adapted for serverless:
 * - No app.listen() call (Vercel handles the HTTP layer)
 * - In-memory stores instead of filesystem (no writable disk in serverless)
 */

import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { basename } from "path";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health ──────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV ?? "production" });
});

// ── Anchors (in-memory) ─────────────────────────────────────────────────────
const anchorsMap = new Map();

app.get("/api/anchors", (_req, res) => {
  res.json(Array.from(anchorsMap.values()));
});

app.post("/api/anchors", (req, res) => {
  if (!req.body.name || typeof req.body.name !== "string") {
    return res.status(400).json({ error: "Campo 'name' requerido" });
  }
  const anchor = {
    id: randomUUID(),
    name: req.body.name,
    modelData: typeof req.body.modelData === "string" ? req.body.modelData : null,
    createdAt: new Date().toISOString(),
  };
  anchorsMap.set(anchor.id, anchor);
  res.status(201).json(anchor);
});

app.get("/api/anchors/:id", (req, res) => {
  const anchor = anchorsMap.get(req.params.id);
  if (!anchor) {
    return res.status(404).json({ error: "Anclaje no encontrado" });
  }
  res.json(anchor);
});

app.delete("/api/anchors/:id", (req, res) => {
  if (!anchorsMap.has(req.params.id)) {
    return res.status(404).json({ error: "Anclaje no encontrado" });
  }
  anchorsMap.delete(req.params.id);
  res.json({ success: true, message: "Anclaje eliminado" });
});

// ── Exports (in-memory, base64) ─────────────────────────────────────────────
const exportsMap = new Map();

app.post("/api/export", (req, res) => {
  if (!req.body.filename || typeof req.body.filename !== "string" || !req.body.data || typeof req.body.data !== "string") {
    return res.status(400).json({ error: "Campos 'filename' y 'data' (base64) requeridos" });
  }
  const safeFilename = basename(req.body.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = Buffer.from(req.body.data, "base64");
  exportsMap.set(safeFilename, buffer);
  res.status(201).json({ filename: safeFilename, url: `/api/export/${safeFilename}` });
});

app.get("/api/export/:filename", (req, res) => {
  const safeFilename = basename(req.params.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = exportsMap.get(safeFilename);
  if (!buffer) {
    return res.status(404).json({ error: "Archivo no encontrado (puede haber expirado)" });
  }
  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(buffer);
});

// Export for Vercel serverless (no app.listen)
export default app;
