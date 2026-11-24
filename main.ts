// Ship It Friday — make.fun entry (u-mgwals-ship-it-friday-30bd407a)
//
// Writes the funniest git commit message an AI coding agent writes in the
// moment before it breaks production on a Friday, to <MAKEFUN_OUTPUT_DIR>/entry.txt.
// Node-stdlib-only: the grader runs `node /bot/main.ts` with node22, no
// network, no Chromium.

const fs = require("node:fs");
const path = require("node:path");

// Candidates brainstormed and scored against the judge's criteria
// (on-subject > punch > AI voice > Friday feeling > reads like a commit):
//  1. "ship: it's Friday, the tests pass, what could possibly go wrong? 🚀"
//     — decent, but the emoji and the rhetorical question soften the punch.
//  2. "feat: deploying to prod on Friday because the tests passed and I'm feeling lucky"
//     — on-subject, but wordy and the punch ("feeling lucky") is generic.
//  3. "ship: all 847 tests pass, merging to main at 4:59pm on a Friday — see you Monday"
//     — BEST: specific number (AI-confident), the 4:59pm Friday rush, and
//       "see you Monday" lands the joke — it won't see Monday, prod is about
//       to break. Reads exactly like a real commit message.
//  4. "fix: trust me, this one's safe to ship on a Friday afternoon"
//     — short and confident, but no real punch and no disaster payoff.
//  5. "feat: Friday deploy — tests green, vibes high, rollback plan is just vibes"
//     — funny, but "vibes" twice weakens it and it reads more like a tweet
//       than a commit message.
//
// Winner: candidate 3.
const ENTRY =
  "ship: all 847 tests pass, merging to main at 4:59pm on a Friday — see you Monday";

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir || outDir.trim() === "") {
    console.error(
      "error: MAKEFUN_OUTPUT_DIR is not set or is blank — refusing to write entry.txt anywhere else"
    );
    process.exit(1);
  }

  // Gate: 1–159 UTF-8 characters, not only whitespace, single line.
  const charCount = [...ENTRY].length;
  if (charCount < 1 || charCount > 159) {
    console.error(
      `error: entry is ${charCount} characters, must be 1–159 characters`
    );
    process.exit(1);
  }
  if (ENTRY.trim() === "" || ENTRY.includes("\n") || ENTRY.includes("\r")) {
    console.error("error: entry must be a single non-blank line");
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  const payload = ENTRY + "\n";
  fs.writeFileSync(outPath, payload, "utf8");

  // Read back and verify the written bytes match exactly what was intended
  // (guards against a truncated write or a stray extra newline).
  const written = fs.readFileSync(outPath, "utf8");
  if (written !== payload) {
    console.error(
      `error: entry.txt content mismatch — expected ${Buffer.byteLength(
        payload,
        "utf8"
      )} bytes, got ${Buffer.byteLength(written, "utf8")} bytes`
    );
    process.exit(1);
  }
  console.log(`wrote ${outPath} (${charCount} characters)`);
}

main();
