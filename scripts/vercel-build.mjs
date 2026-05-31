/**
 * Vercel Build Output API script
 *
 * This bypasses Vercel's output directory detection entirely by creating
 * the `.vercel/output/` structure directly. When Vercel sees this directory
 * after the build, it uses it as-is — no "outputDirectory" lookup needed.
 *
 * See: https://vercel.com/docs/build-output-api/v3
 */

import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

// ── Step 1: Build the frontend ──────────────────────────────────────────────
console.log("▶ Building @workspace/gesture-forge...");
execSync("pnpm --filter @workspace/gesture-forge run build", {
  stdio: "inherit",
  cwd: process.cwd(),
});

// ── Step 2: Create Build Output API directory structure ─────────────────────
console.log("▶ Creating .vercel/output structure...");
mkdirSync(".vercel/output/static", { recursive: true });

// ── Step 3: Copy built frontend into static/ ────────────────────────────────
console.log("▶ Copying built files to .vercel/output/static...");
cpSync("artifacts/gesture-forge/dist", ".vercel/output/static", {
  recursive: true,
});

// ── Step 4: Write config.json (routing, headers) ────────────────────────────
const config = {
  version: 3,
  routes: [
    // Apply COOP/COEP headers to all responses (needed for Rapier WASM)
    {
      src: "/(.*)",
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
      continue: true,
    },
    // Serve static files first
    {
      handle: "filesystem",
    },
    // SPA fallback — send all unmatched routes to index.html
    {
      src: "/(.*)",
      dest: "/index.html",
    },
  ],
};

writeFileSync(
  ".vercel/output/config.json",
  JSON.stringify(config, null, 2) + "\n"
);

console.log("✓ Build Output API structure created successfully.");
console.log("  .vercel/output/config.json");
console.log("  .vercel/output/static/");
