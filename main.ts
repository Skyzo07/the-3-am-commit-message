import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest one-line commit message an AI agent would write right after
// breaking production at 3 AM (82 chars). Chosen by a 3-model CrowLLM panel
// (combined mean 127/150) over 26 drafted candidates; see ../candidates.md.
// Deterministic by construction: the line is a fixed string literal. No
// network, no clock, no randomness, no environment input beyond the output
// directory, so every run writes byte-identical output.
const LINE =
  "fix(prod): my context window ended mid-deploy and I filled the gap with confidence";

// Runtime guard: the gate requires UTF-8 text of 1-200 characters, not only
// whitespace, a single unpadded line with no line breaks. Fail loudly if the
// line ever violates that.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry line must be 1-200 chars, got ${LINE.length}`);
}
if (LINE.trim() !== LINE) {
  throw new Error("entry line must not be padded with leading/trailing whitespace");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry line must contain no line breaks");
}
if (LINE.trim().length === 0) {
  throw new Error("entry line must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// Write exactly the line, no trailing newline, so the file is byte-identical
// to the winning commit message.
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
