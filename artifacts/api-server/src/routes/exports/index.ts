import { Router, type IRouter } from "express";
import { basename } from "path";
import {
  SaveExportBody,
  DownloadExportParams,
} from "@workspace/api-zod";

// In-memory export store keyed by filename.
// Vercel serverless has no writable filesystem, so we keep exports in memory.
// Files are available until the function instance recycles (typically minutes).
const exportsMap = new Map<string, Buffer>();

const router: IRouter = Router();

router.post("/export", async (req, res): Promise<void> => {
  const parsed = SaveExportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const safeFilename = basename(parsed.data.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = Buffer.from(parsed.data.data, "base64");
  exportsMap.set(safeFilename, buffer);

  req.log.info({ filename: safeFilename }, "Export guardado en memoria");
  res.status(201).json({ filename: safeFilename, url: `/api/export/${safeFilename}` });
});

router.get("/export/:filename", async (req, res): Promise<void> => {
  const params = DownloadExportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const safeFilename = basename(params.data.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const buffer = exportsMap.get(safeFilename);

  if (!buffer) {
    res.status(404).json({ error: "Archivo no encontrado (puede haber expirado)" });
    return;
  }

  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(buffer);
});

export default router;
