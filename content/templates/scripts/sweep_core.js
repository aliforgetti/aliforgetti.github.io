/*
sweep_core - THE sweep logic. The only copy of the rules.

Runs in two places off this single file (no drift possible):
  - ./sweep at repo root (node), every 5 min via launchd
  - Templater on desktop OR PHONE, via templates/run sweep.md

The rules (same as always):
  - daily notes (today or earlier): every "- [ ]" task in the
    ## inbox section moves to the board. inboxes exist to drain
  - stream pages: only PREFIXED tasks move ("- [ ] Push AE — x").
    bare checkboxes are checklists and belong to their note
  - a line carrying #soon lands in the `soon` column (tag
    stripped); everything else lands in `backlog`
  - indented children travel with their task. moves, never
    copies. never touches [x], comments, thoughts, future days

env contract (each runner provides these):
  env.read(path)         -> string content
  env.write(path, s)     -> writes it
  env.listDaily()        -> filenames in private/daily
  env.listStreams()      -> vault-relative paths of stream .md files
  env.today              -> "YYYY-MM-DD"
Paths are vault-relative ("private/board.md").
*/

const TASK = /^\s*- \[ \] /;
const PREFIXED = /^\s*- \[ \] \S+( \S+){0,3} [—–-] \S/;

function takeTasks(lines, start, end, prefixedOnly) {
  const matcher = prefixedOnly ? PREFIXED : TASK;
  const keep = [], taken = [];
  let i = start, inComment = false;
  while (i < end) {
    const line = lines[i];
    if (line.includes("<!--")) inComment = true;
    if (line.includes("-->")) {
      inComment = false;
      keep.push(line); i += 1; continue;
    }
    if (!inComment && matcher.test(line)) {
      const block = [line];
      i += 1;
      while (i < end && lines[i].trim() &&
             (lines[i].startsWith("\t") || lines[i].startsWith("    "))) {
        block.push(lines[i]); i += 1;
      }
      taken.push(block);
    } else {
      keep.push(line); i += 1;
    }
  }
  return [keep, taken];
}

function appendToColumn(board, column, blocks) {
  if (!blocks.length) return board;
  const re = new RegExp(
    "(## " + column + "\\n)([\\s\\S]*?)(?=\\n## |\\n\\*\\*\\*|\\n%% kanban)");
  const m = board.match(re);
  if (!m) throw new Error(
    "no '## " + column + "' column found in board.md - add one, " +
    "or rename the column back to '" + column + "'");
  let section = m[2].replace(/\n+$/, "");
  for (const [block] of blocks) section += "\n" + block.join("\n");
  const at = m.index + m[1].length;
  const rest = board.slice(at + m[2].length).replace(/^\n+/, "");
  return board.slice(0, at) + section + "\n\n" + rest;
}

async function sweep(env) {
  const moved = [];   // [block, sourceName]

  // 1. daily inboxes, today or earlier ------------------------
  for (const name of (await env.listDaily()).sort()) {
    if (!name.endsWith(".md") || name.slice(0, -3) > env.today) continue;
    const path = "private/daily/" + name;
    const lines = (await env.read(path)).split("\n");

    let start = null, end = null;
    for (let i = 0; i < lines.length; i++) {
      if (start === null && lines[i].trim() === "## inbox") start = i + 1;
      else if (start !== null && lines[i].startsWith("## ")) { end = i; break; }
    }
    if (start === null) continue;
    if (end === null) end = lines.length;

    const [kept, taken] = takeTasks(lines, start, end, false);
    if (!taken.length) continue;
    await env.write(path,
      lines.slice(0, start).concat(kept, lines.slice(end)).join("\n"));
    for (const b of taken) moved.push([b, name]);
  }

  // 2. stream pages, prefixed tasks only ----------------------
  for (const path of (await env.listStreams()).sort()) {
    const lines = (await env.read(path)).split("\n");
    const [kept, taken] = takeTasks(lines, 0, lines.length, true);
    if (!taken.length) continue;
    await env.write(path, kept.join("\n"));
    for (const b of taken) moved.push([b, path]);
  }

  if (!moved.length) return { moved: [], summary: "sweep: nothing to move." };

  // 3. route: #soon -> soon column, else backlog --------------
  const toSoon = [], toBacklog = [];
  for (const [block, src] of moved) {
    if (block[0].includes("#soon")) {
      block[0] = block[0].replace(" #soon", "").replace("#soon", "")
                         .replace(/\s+$/, "");
      toSoon.push([block, src]);
    } else {
      toBacklog.push([block, src]);
    }
  }

  let board = await env.read("private/board.md");
  board = appendToColumn(board, "soon", toSoon);
  board = appendToColumn(board, "backlog", toBacklog);
  await env.write("private/board.md", board);

  const lineOf = (b) => b[0].replace(TASK, "").trim();
  const report = []
    .concat(toSoon.map(([b, s]) => "  soon    - " + lineOf(b) + "   (from " + s + ")"))
    .concat(toBacklog.map(([b, s]) => "  backlog - " + lineOf(b) + "   (from " + s + ")"));
  return {
    moved: moved,
    summary: "sweep: moved " + moved.length + " task(s) to the board:\n" +
             report.join("\n"),
  };
}

module.exports = sweep;
