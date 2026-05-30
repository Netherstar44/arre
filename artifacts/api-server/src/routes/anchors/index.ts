import { Router, type IRouter } from "express";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import {
  ListAnchorsResponse,
  GetAnchorResponse,
  CreateAnchorBody,
  GetAnchorParams,
  DeleteAnchorParams,
  DeleteAnchorResponse,
} from "@workspace/api-zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, "../../data");
const ANCHORS_FILE = join(DATA_DIR, "anchors.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readAnchors(): unknown[] {
  ensureDataDir();
  if (!existsSync(ANCHORS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(ANCHORS_FILE, "utf-8")) as unknown[];
  } catch {
    return [];
  }
}

function writeAnchors(anchors: unknown[]) {
  ensureDataDir();
  writeFileSync(ANCHORS_FILE, JSON.stringify(anchors, null, 2), "utf-8");
}

const router: IRouter = Router();

router.get("/anchors", async (req, res): Promise<void> => {
  const anchors = readAnchors();
  res.json(ListAnchorsResponse.parse(anchors));
});

router.post("/anchors", async (req, res): Promise<void> => {
  const parsed = CreateAnchorBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid anchor body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const anchor = {
    id: randomUUID(),
    ...parsed.data,
    modelData: parsed.data.modelData ?? null,
    createdAt: new Date().toISOString(),
  };

  const anchors = readAnchors();
  anchors.push(anchor);
  writeAnchors(anchors);

  res.status(201).json(GetAnchorResponse.parse(anchor));
});

router.get("/anchors/:id", async (req, res): Promise<void> => {
  const params = GetAnchorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const anchors = readAnchors() as Array<{ id: string }>;
  const anchor = anchors.find((a) => a.id === params.data.id);

  if (!anchor) {
    res.status(404).json({ error: "Anclaje no encontrado" });
    return;
  }

  res.json(GetAnchorResponse.parse(anchor));
});

router.delete("/anchors/:id", async (req, res): Promise<void> => {
  const params = DeleteAnchorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const anchors = readAnchors() as Array<{ id: string }>;
  const index = anchors.findIndex((a) => a.id === params.data.id);

  if (index === -1) {
    res.status(404).json({ error: "Anclaje no encontrado" });
    return;
  }

  anchors.splice(index, 1);
  writeAnchors(anchors);

  res.json(DeleteAnchorResponse.parse({ success: true, message: "Anclaje eliminado" }));
});

export default router;
