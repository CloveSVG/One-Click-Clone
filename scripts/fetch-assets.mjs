#!/usr/bin/env node

/**
 * fetch-assets.mjs
 *
 * Downloads all media assets listed in docs/research/asset-manifest.json
 * and organizes them into the public/ directory tree.
 *
 * Usage:
 *   node scripts/fetch-assets.mjs                     # uses default manifest
 *   node scripts/fetch-assets.mjs --manifest path.json # custom manifest
 *   node scripts/fetch-assets.mjs --concurrency 10     # parallel limit
 *
 * Asset manifest format (docs/research/asset-manifest.json):
 * {
 *   "images":  [{ "url": "...", "name": "hero.webp" }],
 *   "videos":  [{ "url": "...", "name": "demo.mp4" }],
 *   "fonts":   [{ "url": "...", "name": "custom-sans-400.woff2" }],
 *   "seo":     [{ "url": "...", "name": "favicon.ico" }]
 * }
 */

import { existsSync, mkdirSync, createWriteStream, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

/** Map each asset category to its output directory under public/ */
const CATEGORY_DIRS = {
  images: join(PROJECT_ROOT, "public", "images"),
  videos: join(PROJECT_ROOT, "public", "videos"),
  fonts: join(PROJECT_ROOT, "public", "fonts"),
  seo: join(PROJECT_ROOT, "public", "seo"),
};

/** Recognised extensions per category (for validation warnings) */
const EXPECTED_EXTENSIONS = {
  images: new Set([
    ".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif", ".ico",
  ]),
  videos: new Set([".mp4", ".webm", ".mov", ".ogg"]),
  fonts: new Set([".woff2", ".woff", ".ttf", ".otf", ".eot"]),
  seo: new Set([
    ".ico", ".png", ".svg", ".webp", ".webmanifest", ".json", ".xml",
  ]),
};

const DEFAULT_CONCURRENCY = 6;
const MAX_RETRIES = 1;
const REQUEST_TIMEOUT_MS = 60_000;

// ---------------------------------------------------------------------------
// CLI argument parsing (no deps)
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    manifest: join(PROJECT_ROOT, "docs", "research", "asset-manifest.json"),
    concurrency: DEFAULT_CONCURRENCY,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--manifest" && args[i + 1]) {
      options.manifest = resolve(args[++i]);
    } else if (args[i] === "--concurrency" && args[i + 1]) {
      const n = parseInt(args[++i], 10);
      if (Number.isFinite(n) && n > 0) options.concurrency = n;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(
        "Usage: node scripts/fetch-assets.mjs [--manifest path.json] [--concurrency N]"
      );
      process.exit(0);
    }
  }

  return options;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sanitise a URL or name into a safe, readable filename.
 * Keeps the original name if one is provided; otherwise derives from URL.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[?#].*$/, "") // strip query / fragment
    .replace(/[^\w.\-]/g, "_") // replace unsafe chars
    .replace(/_+/g, "_") // collapse runs
    .replace(/^_|_$/g, ""); // trim leading/trailing _
}

/**
 * Derive a friendly filename when the manifest entry has no explicit name.
 */
function filenameFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const base = pathname.split("/").filter(Boolean).pop() || "asset";
    return sanitizeFilename(decodeURIComponent(base));
  } catch {
    return "asset";
  }
}

/**
 * Return the lowercase extension including the dot, e.g. ".webp"
 */
function extOf(filename) {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

/**
 * Download a single URL to a local file path.
 * Returns { ok, url, dest, bytes, error? }
 */
async function downloadFile(url, dest) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "*/*",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  const writer = createWriteStream(dest);
  await pipeline(res.body, writer);

  const bytes = statSync(dest).size;
  return { ok: true, url, dest, bytes };
}

/**
 * Download with retry logic.
 */
async function downloadWithRetry(url, dest, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await downloadFile(url, dest);
    } catch (err) {
      if (attempt < retries) {
        // Brief delay before retry
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      return { ok: false, url, dest, bytes: 0, error: err.message };
    }
  }
}

/**
 * Run an array of async tasks with a concurrency limit.
 */
async function parallelMap(items, fn, concurrency) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Format byte count to human-readable string.
 */
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exp;
  return `${value.toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const options = parseArgs(process.argv);

  // ---- Load manifest ---------------------------------------------------

  if (!existsSync(options.manifest)) {
    console.error(`\nManifest not found: ${options.manifest}`);
    console.error(
      "Create docs/research/asset-manifest.json with your asset list."
    );
    console.error("See scripts/fetch-assets.mjs header for the expected format.\n");
    process.exit(1);
  }

  let manifest;
  try {
    const raw = await readFile(options.manifest, "utf-8");
    manifest = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse manifest: ${err.message}`);
    process.exit(1);
  }

  // ---- Build download queue --------------------------------------------

  const queue = []; // { url, dest, category, name }

  for (const category of Object.keys(CATEGORY_DIRS)) {
    const entries = manifest[category];
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const outDir = CATEGORY_DIRS[category];
    mkdirSync(outDir, { recursive: true });

    for (const entry of entries) {
      if (!entry.url) {
        console.warn(`  [WARN] Skipping entry with no URL in "${category}"`);
        continue;
      }

      const name = sanitizeFilename(entry.name || filenameFromUrl(entry.url));
      const dest = join(outDir, name);
      const ext = extOf(name);

      // Warn on unexpected extension
      if (ext && EXPECTED_EXTENSIONS[category] && !EXPECTED_EXTENSIONS[category].has(ext)) {
        console.warn(
          `  [WARN] "${name}" has unexpected extension "${ext}" for category "${category}"`
        );
      }

      queue.push({ url: entry.url, dest, category, name });
    }
  }

  if (queue.length === 0) {
    console.log("\nNo assets to download. Manifest is empty or has no valid entries.\n");
    process.exit(0);
  }

  // ---- Download --------------------------------------------------------

  console.log(`\nFetching ${queue.length} assets (concurrency: ${options.concurrency})\n`);

  const stats = { downloaded: 0, skipped: 0, failed: 0, totalBytes: 0 };
  const failures = [];

  const results = await parallelMap(
    queue,
    async (item, idx) => {
      const progress = `[${idx + 1}/${queue.length}]`;

      // Skip already-downloaded files
      if (existsSync(item.dest)) {
        try {
          const size = statSync(item.dest).size;
          if (size > 0) {
            stats.skipped++;
            console.log(`  ${progress} SKIP  ${item.category}/${item.name} (exists)`);
            return { ...item, ok: true, skipped: true, bytes: size };
          }
        } catch {
          // file stat failed, re-download
        }
      }

      const result = await downloadWithRetry(item.url, item.dest);

      if (result.ok) {
        stats.downloaded++;
        stats.totalBytes += result.bytes;
        console.log(
          `  ${progress} OK    ${item.category}/${item.name} (${formatBytes(result.bytes)})`
        );
      } else {
        stats.failed++;
        failures.push({ name: item.name, url: item.url, error: result.error });
        console.log(
          `  ${progress} FAIL  ${item.category}/${item.name} -- ${result.error}`
        );
      }

      return { ...item, ...result };
    },
    options.concurrency
  );

  // ---- Summary ---------------------------------------------------------

  console.log("\n--- Download Summary ---");
  console.log(`  Downloaded : ${stats.downloaded} (${formatBytes(stats.totalBytes)})`);
  console.log(`  Skipped    : ${stats.skipped} (already exist)`);
  console.log(`  Failed     : ${stats.failed}`);
  console.log(`  Total      : ${queue.length}`);

  if (failures.length > 0) {
    console.log("\nFailed assets:");
    for (const f of failures) {
      console.log(`  - ${f.name}: ${f.error}`);
      console.log(`    ${f.url}`);
    }
  }

  console.log();

  // Exit with error code if any downloads failed
  if (stats.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
