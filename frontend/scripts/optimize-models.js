/**
 * Optimize .glb models: max texture 1024×1024, then Draco mesh compression.
 * Reads:  public/models/*.glb
 * Writes: public/avatars/optimized/*.glb (same filenames)
 *
 * Run from frontend/: npm run optimize:models
 */
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const MODELS_DIR = join(PROJECT_ROOT, "public", "models");
const OUT_DIR = join(PROJECT_ROOT, "public", "avatars", "optimized");
const CLI_JS = join(
  PROJECT_ROOT,
  "node_modules",
  "@gltf-transform",
  "cli",
  "bin",
  "cli.js"
);

const MAX_TEXTURE = 1024;

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function runGltfTransform(args) {
  execFileSync(process.execPath, [CLI_JS, ...args], {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    env: process.env,
  });
}

function optimizeOne(inputPath, outputPath) {
  const before = statSync(inputPath).size;
  const tmpPath = join(tmpdir(), `gltf-opt-${randomUUID()}.glb`);

  try {
    runGltfTransform([
      "resize",
      inputPath,
      tmpPath,
      "--width",
      String(MAX_TEXTURE),
      "--height",
      String(MAX_TEXTURE),
    ]);
    runGltfTransform(["draco", tmpPath, outputPath]);
  } finally {
    try {
      if (existsSync(tmpPath)) unlinkSync(tmpPath);
    } catch {
      /* ignore cleanup errors */
    }
  }

  const after = statSync(outputPath).size;
  const saved = before - after;
  const pct = before > 0 ? ((saved / before) * 100).toFixed(1) : "0.0";

  return { before, after, saved, pct };
}

function main() {
  if (!existsSync(CLI_JS)) {
    console.error(
      "[optimize-models] Missing @gltf-transform/cli. Run: npm install"
    );
    process.exit(1);
  }

  if (!existsSync(MODELS_DIR)) {
    mkdirSync(MODELS_DIR, { recursive: true });
    console.log(
      `[optimize-models] Created ${MODELS_DIR} — add .glb files and run again.`
    );
    process.exit(0);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(MODELS_DIR).filter(
    (name) => name.toLowerCase().endsWith(".glb")
  );

  if (files.length === 0) {
    console.log(`[optimize-models] No .glb files in ${MODELS_DIR}`);
    process.exit(0);
  }

  console.log(
    `[optimize-models] Processing ${files.length} file(s) → ${OUT_DIR}\n`
  );

  let failures = 0;

  for (const name of files) {
    const inputPath = join(MODELS_DIR, name);
    const outputPath = join(OUT_DIR, name);

    if (!statSync(inputPath).isFile()) continue;

    console.log(`— ${name}`);

    try {
      const { before, after, saved, pct } = optimizeOne(inputPath, outputPath);
      const delta =
        saved >= 0
          ? `-${formatBytes(saved)} (${pct}% smaller)`
          : `+${formatBytes(-saved)} (larger)`;
      console.log(
        `  Before: ${formatBytes(before)}  →  After: ${formatBytes(after)}  (${delta})`
      );
    } catch (err) {
      failures += 1;
      console.error(`  ERROR: ${err?.message || err}`);
      try {
        if (existsSync(outputPath)) unlinkSync(outputPath);
      } catch {
        /* ignore */
      }
    }
  }

  console.log(
    failures
      ? `\n[optimize-models] Finished with ${failures} error(s).`
      : "\n[optimize-models] Done."
  );
  process.exit(failures > 0 ? 1 : 0);
}

main();
