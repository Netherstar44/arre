import { Router, type IRouter } from "express";
import { writeFileSync, existsSync, mkdirSync, createReadStream } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import {
  SaveExportBody,
  DownloadExportParams,
} from "@workspace/api-zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EXPORTS_DIR = join(__dirname, "../../exports");

function ensureExportsDir() {
  if (!existsSync(EXPORTS_DIR)) {
    mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

const router: IRouter = Router();

router.post("/export", async (req, res): Promise<void> => {
  const parsed = SaveExportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  ensureExportsDir();

  const safeFilename = basename(parsed.data.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const filepath = join(EXPORTS_DIR, safeFilename);

  const buffer = Buffer.from(parsed.data.data, "base64");
  writeFileSync(filepath, buffer);

  req.log.info({ filename: safeFilename }, "Export guardado");
  res.status(201).json({ filename: safeFilename, url: `/api/export/${safeFilename}` });
});

router.get("/export/:filename", async (req, res): Promise<void> => {
  const params = DownloadExportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const safeFilename = basename(params.data.filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const filepath = join(EXPORTS_DIR, safeFilename);

  if (!existsSync(filepath)) {
    res.status(404).json({ error: "Archivo no encontrado" });
    return;
  }

  res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
  res.setHeader("Content-Type", "application/octet-stream");
  const stream = createReadStream(filepath);
  stream.pipe(res);
});

export default router;
