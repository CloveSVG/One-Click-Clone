#!/usr/bin/env node

/**
 * sync-commands.mjs
 *
 * Regenerates the /site-clone command for all supported AI agent platforms
 * from the canonical source at .claude/skills/site-clone/SKILL.md.
 *
 * Usage:
 *   node scripts/sync-commands.mjs
 *
 * Generated targets:
 *   .codex/skills/site-clone/SKILL.md      — Copy as-is
 *   .github/skills/site-clone/SKILL.md     — Copy as-is
 *   .cursor/commands/site-clone.md          — $ARGUMENTS -> literal description
 *   .windsurf/workflows/site-clone.md       — $ARGUMENTS -> literal description
 *   .gemini/commands/site-clone.toml        — TOML format, $ARGUMENTS -> {{args}}
 *   .opencode/commands/site-clone.md        — Copy with YAML frontmatter
 *   .augment/commands/site-clone.md         — Copy with YAML frontmatter
 *   .continue/commands/site-clone.md        — Copy with YAML frontmatter
 *   .amazonq/cli-agents/site-clone.json     — JSON format
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..");

const SOURCE_PATH = join(
  PROJECT_ROOT,
  ".claude",
  "skills",
  "site-clone",
  "SKILL.md"
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse YAML frontmatter from a markdown string.
 * Returns { meta: {key: value}, body: string }.
 */
function parseFrontmatter(content) {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = content.match(fmRegex);

  if (!match) {
    return { meta: {}, body: content };
  }

  const rawYaml = match[1];
  const body = match[2];
  const meta = {};

  // Simple line-by-line YAML parser (handles key: value and key: "value")
  for (const line of rawYaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    meta[key] = value;
  }

  return { meta, body };
}

/**
 * Build YAML frontmatter string from a metadata object.
 */
function buildFrontmatter(meta) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(meta)) {
    // Quote values that contain special YAML characters
    const needsQuotes = /[:#\[\]{}&*!|>'"`,@]/.test(value) || value === "";
    lines.push(`${key}: ${needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value}`);
  }
  lines.push("---");
  return lines.join("\n");
}

/**
 * Ensure the parent directory of a file path exists.
 */
function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Write a file and log the action.
 */
function writeTarget(relPath, content) {
  const absPath = join(PROJECT_ROOT, relPath);
  ensureDir(absPath);
  writeFileSync(absPath, content, "utf-8");
  console.log(`  Generated: ${relPath}`);
}

/**
 * Escape a string for use in a TOML quoted value.
 */
function escapeToml(str) {
  // Use TOML multi-line literal string (triple single quotes) for long content
  // If the content contains triple single quotes, fall back to basic string
  if (!str.includes("'''")) {
    return "'''\n" + str + "'''";
  }
  return (
    '"""' +
    str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n") +
    '"""'
  );
}

// ---------------------------------------------------------------------------
// Target generators
// ---------------------------------------------------------------------------

/**
 * Each generator receives { meta, body, fullContent } and returns { relPath, content }.
 */
const TARGETS = [
  // 1. Codex — copy as-is
  {
    relPath: ".codex/skills/site-clone/SKILL.md",
    generate({ fullContent }) {
      return fullContent;
    },
  },

  // 2. GitHub — copy as-is
  {
    relPath: ".github/skills/site-clone/SKILL.md",
    generate({ fullContent }) {
      return fullContent;
    },
  },

  // 3. Cursor — replace $ARGUMENTS with human-readable description
  {
    relPath: ".cursor/commands/site-clone.md",
    generate({ fullContent }) {
      return fullContent.replace(
        /\$ARGUMENTS/g,
        "the target URL(s) provided by the user"
      );
    },
  },

  // 4. Windsurf — same replacement as Cursor
  {
    relPath: ".windsurf/workflows/site-clone.md",
    generate({ fullContent }) {
      return fullContent.replace(
        /\$ARGUMENTS/g,
        "the target URL(s) provided by the user"
      );
    },
  },

  // 5. Gemini — convert to TOML format
  {
    relPath: ".gemini/commands/site-clone.toml",
    generate({ meta, body }) {
      const name = meta.name || "site-clone";
      const description =
        meta.description || "Reverse-engineer and clone a website";

      // Replace $ARGUMENTS with {{args}} in the body
      const prompt = body.trim().replace(/\$ARGUMENTS/g, "{{args}}");

      const lines = [
        "[command]",
        `name = "${name}"`,
        `description = "${description.replace(/"/g, '\\"')}"`,
        `prompt = ${escapeToml(prompt)}`,
      ];

      return lines.join("\n") + "\n";
    },
  },

  // 6. OpenCode — copy with YAML frontmatter
  {
    relPath: ".opencode/commands/site-clone.md",
    generate({ meta, body }) {
      const fm = buildFrontmatter({
        name: meta.name || "site-clone",
        description:
          meta.description || "Reverse-engineer and clone a website",
      });
      return fm + "\n\n" + body;
    },
  },

  // 7. Augment — copy with YAML frontmatter
  {
    relPath: ".augment/commands/site-clone.md",
    generate({ meta, body }) {
      const fm = buildFrontmatter({
        name: meta.name || "site-clone",
        description:
          meta.description || "Reverse-engineer and clone a website",
      });
      return fm + "\n\n" + body;
    },
  },

  // 8. Continue — copy with YAML frontmatter
  {
    relPath: ".continue/commands/site-clone.md",
    generate({ meta, body }) {
      const fm = buildFrontmatter({
        name: meta.name || "site-clone",
        description:
          meta.description || "Reverse-engineer and clone a website",
      });
      return fm + "\n\n" + body;
    },
  },

  // 9. Amazon Q — convert to JSON format
  {
    relPath: ".amazonq/cli-agents/site-clone.json",
    generate({ meta, body }) {
      const obj = {
        name: meta.name || "site-clone",
        description:
          meta.description || "Reverse-engineer and clone a website",
        prompt: body.trim(),
      };
      return JSON.stringify(obj, null, 2) + "\n";
    },
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("");
  console.log("sync-commands: regenerating /site-clone for all platforms");
  console.log("");

  // Read source file
  if (!existsSync(SOURCE_PATH)) {
    console.error(`Source file not found: ${SOURCE_PATH}`);
    console.error(
      "Expected the canonical skill definition at .claude/skills/site-clone/SKILL.md"
    );
    process.exit(1);
  }

  let fullContent;
  try {
    fullContent = readFileSync(SOURCE_PATH, "utf-8");
  } catch (err) {
    console.error(`Failed to read source file: ${err.message}`);
    process.exit(1);
  }

  // Parse frontmatter
  const { meta, body } = parseFrontmatter(fullContent);

  if (Object.keys(meta).length > 0) {
    console.log(`  Source metadata: ${JSON.stringify(meta)}`);
  }
  console.log(
    `  Source body: ${body.trim().length} characters`
  );
  console.log("");

  // Generate each target
  let generated = 0;
  let errors = 0;

  for (const target of TARGETS) {
    try {
      const content = target.generate({ meta, body, fullContent });
      writeTarget(target.relPath, content);
      generated++;
    } catch (err) {
      console.error(`  FAILED: ${target.relPath} -- ${err.message}`);
      errors++;
    }
  }

  // Summary
  console.log("");
  console.log(`Done. ${generated} files generated, ${errors} errors.`);
  console.log("");

  if (errors > 0) {
    process.exit(1);
  }
}

main();
