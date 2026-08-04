#!/usr/bin/env node
/*
sweep (node runner) - thin I/O adapter around the ONE logic
file: content/templates/scripts/sweep_core.js

Run:  ./sweep     (bash wrapper finds node, calls this)

All rules live in sweep_core.js - the same file Templater
runs on the phone. This file only reads and writes disk.
*/

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const VAULT = path.join(ROOT, "content");
const sweep = require(path.join(VAULT, "templates", "scripts", "sweep_core.js"));

const env = {
  today: new Date().toISOString().slice(0, 10),
  read: async (p) => fs.readFileSync(path.join(VAULT, p), "utf-8"),
  write: async (p, s) => fs.writeFileSync(path.join(VAULT, p), s),
  listDaily: async () => fs.readdirSync(path.join(VAULT, "private", "daily")),
  listStreams: async () => {
    const out = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith(".md"))
          out.push(path.relative(VAULT, full).split(path.sep).join("/"));
      }
    };
    walk(path.join(VAULT, "private", "streams"));
    return out;
  },
};

sweep(env)
  .then((r) => console.log(r.summary))
  .catch((e) => {
    console.log("sweep: FAILED - " + e.message);
    console.log("Nothing may be partially moved - check the board.");
    process.exit(1);
  });
