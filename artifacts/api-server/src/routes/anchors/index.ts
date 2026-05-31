import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import {
  ListAnchorsResponse,
  GetAnchorResponse,
  CreateAnchorBody,
  GetAnchorParams,
  DeleteAnchorParams,
  DeleteAnchorResponse,
} from "@workspace/api-zod";

// In-memory store — the frontend (anchorStore.ts) is the persistent source of truth via localStorage.
// This backend store is secondary / optional; data resets on cold starts which is acceptable.
const anchorsMap = new Map<string, unknown>();

const router: IRouter = Router();

router.get("/anchors", async (_req, res): Promise<void> => {
  const anchors = Array.from(anchorsMap.values());
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

  anchorsMap.set(anchor.id, anchor);
  res.status(201).json(GetAnchorResponse.parse(anchor));
});

router.get("/anchors/:id", async (req, res): Promise<void> => {
  const params = GetAnchorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const anchor = anchorsMap.get(params.data.id);
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

  if (!anchorsMap.has(params.data.id)) {
    res.status(404).json({ error: "Anclaje no encontrado" });
    return;
  }

  anchorsMap.delete(params.data.id);
  res.json(DeleteAnchorResponse.parse({ success: true, message: "Anclaje eliminado" }));
});

export default router;
