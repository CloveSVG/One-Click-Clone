#!/usr/bin/env bash

# sync-platforms.sh
#
# Regenerates platform-specific AI agent instruction files from PROJECT.md.
# Resolves @filepath import references by inlining the referenced file content.
#
# Usage:
#   bash scripts/sync-platforms.sh
#
# Source of truth: PROJECT.md in the repository root.
# Outputs:
#   .github/copilot-instructions.md   (GitHub Copilot Chat)
#   .clinerules                        (Cline / Roo Code)
#   .continue/rules/project.md         (Continue)
#   .amazonq/rules/project.md          (Amazon Q)

set -euo pipefail

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_FILE="$PROJECT_ROOT/PROJECT.md"

# Output targets — each entry is "relative_path"
TARGETS=(
  ".github/copilot-instructions.md"
  ".clinerules"
  ".continue/rules/project.md"
  ".amazonq/rules/project.md"
)

AUTO_HEADER="<!-- AUTO-GENERATED from PROJECT.md — do not edit manually. -->"

# ---------------------------------------------------------------------------
# Functions
# ---------------------------------------------------------------------------

log()  { printf "  %s\n" "$*"; }
warn() { printf "  [WARN] %s\n" "$*" >&2; }
die()  { printf "  [ERROR] %s\n" "$*" >&2; exit 1; }

# Resolve @filepath references in the source content.
# Lines that consist solely of @path/to/file (with optional leading whitespace)
# are replaced with the contents of that file.
resolve_imports() {
  local content="$1"
  local result=""
  local line

  while IFS= read -r line || [[ -n "$line" ]]; do
    # Match lines like: @path/to/file.md  (with optional leading/trailing whitespace)
    if [[ "$line" =~ ^[[:space:]]*@([^[:space:]]+)[[:space:]]*$ ]]; then
      local ref_path="${BASH_REMATCH[1]}"
      local abs_path="$PROJECT_ROOT/$ref_path"

      if [[ -f "$abs_path" ]]; then
        # Read the referenced file and append it
        result+="$(cat "$abs_path")"
        result+=$'\n'
      else
        warn "Referenced file not found: $ref_path (skipping import)"
        result+="$line"
        result+=$'\n'
      fi
    else
      result+="$line"
      result+=$'\n'
    fi
  done <<< "$content"

  printf '%s' "$result"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  echo ""
  echo "sync-platforms: regenerating AI agent instruction files"
  echo ""

  # Verify source file exists
  if [[ ! -f "$SOURCE_FILE" ]]; then
    die "Source file not found: $SOURCE_FILE"
  fi

  # Read and resolve imports
  local raw_content
  raw_content="$(cat "$SOURCE_FILE")"

  log "Resolving @imports in PROJECT.md..."
  local resolved_content
  resolved_content="$(resolve_imports "$raw_content")"

  # Build the final output (header + blank line + resolved content)
  local output
  output="${AUTO_HEADER}"$'\n\n'"${resolved_content}"

  # Generate each target file
  local generated=0

  for rel_path in "${TARGETS[@]}"; do
    local abs_path="$PROJECT_ROOT/$rel_path"
    local parent_dir
    parent_dir="$(dirname "$abs_path")"

    # Create parent directories if needed
    if [[ ! -d "$parent_dir" ]]; then
      mkdir -p "$parent_dir"
      log "Created directory: $rel_path -> $(dirname "$rel_path")"
    fi

    # Write the file
    printf '%s\n' "$output" > "$abs_path"
    generated=$((generated + 1))
    log "Generated: $rel_path"
  done

  echo ""
  echo "Done. $generated files generated from PROJECT.md."
  echo ""
}

main "$@"
