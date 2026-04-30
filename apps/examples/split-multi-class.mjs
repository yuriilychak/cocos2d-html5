// Splits a multi-class JS file into one-class-per-file siblings using acorn.
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { dirname, basename, join, relative } from "path";
import * as acorn from "acorn";

const file = process.argv[2];
if (!file) { console.error("usage"); process.exit(1); }

const dir = dirname(file);
const src = readFileSync(file, "utf-8");

const commentList = [];
const ast = acorn.parse(src, {
  sourceType: "module", ecmaVersion: 2022, locations: true, ranges: true,
  onComment: (block, text, start, end, locStart, locEnd) =>
    commentList.push({ block, text, start, end, locStart, locEnd })
});

function kebab(s) { return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_+/g, "-").toLowerCase(); }

let licenseEnd = 0;
if (commentList.length && commentList[0].locStart.line === 1 && commentList[0].block) {
  licenseEnd = commentList[0].end;
}
const license = licenseEnd > 0 ? src.slice(0, licenseEnd) + "\n\n" : "";

function leadingCommentsFor(i, body) {
  const stmt = body[i];
  const prevEnd = i === 0 ? licenseEnd : body[i-1].end;
  const cs = commentList.filter(c => c.start >= prevEnd && c.end <= stmt.start);
  if (cs.length === 0) return "";
  return src.slice(cs[0].start, cs[cs.length-1].end);
}

function classifyStmt(stmt) {
  if (stmt.type === "ExportNamedDeclaration" && stmt.declaration && stmt.declaration.type === "ClassDeclaration")
    return { kind: "class", name: stmt.declaration.id.name };
  if (stmt.type === "ClassDeclaration")
    return { kind: "class", name: stmt.id.name };
  return { kind: "other" };
}

const body = ast.body;
const chunks = [];
for (let i = 0; i < body.length; i++) {
  const stmt = body[i];
  const cls = classifyStmt(stmt);
  const text = src.slice(stmt.start, stmt.end);
  const leading = leadingCommentsFor(i, body);
  chunks.push({ kind: cls.kind, name: cls.name, text, leading });
}

const firstClassIdx = chunks.findIndex(c => c.kind === "class");
if (firstClassIdx < 0) { console.error("no classes"); process.exit(0); }

const preChunks = chunks.slice(0, firstClassIdx).filter(c => c.kind !== "class");
const classChunks = [];
const postChunks = [];
for (let i = firstClassIdx; i < chunks.length; i++) {
  if (chunks[i].kind === "class") classChunks.push(chunks[i]);
  else postChunks.push(chunks[i]);
}

const outFiles = [];
function writeChunk(name, arr) {
  const parts = arr.map(c => (c.leading ? c.leading + "\n" : "") + c.text);
  const content = license + parts.join("\n\n").trimEnd() + "\n";
  const path = join(dir, name);
  writeFileSync(path, content);
  outFiles.push(path);
}

const baseKebab = kebab(basename(file, ".js"));
if (preChunks.length) writeChunk(`${baseKebab}-constants.js`, preChunks);
for (const c of classChunks) writeChunk(`${kebab(c.name)}.js`, [c]);
if (postChunks.length) writeChunk(`${baseKebab}-helpers.js`, postChunks);

const filesMjsPath = join(process.cwd(), "files.mjs");
let mjs = readFileSync(filesMjsPath, "utf-8");
const relOld = relative(process.cwd(), file);
const newRels = outFiles.map(f => relative(process.cwd(), f));
const re = new RegExp(`^[ \\t]*"${relOld.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}"\\s*,?[ \\t]*\\n`, "m");
const replacement = newRels.map(p => `  "${p}",\n`).join("");
if (!re.test(mjs)) { console.error("not found in files.mjs:", relOld); process.exit(1); }
mjs = mjs.replace(re, replacement);
writeFileSync(filesMjsPath, mjs);

unlinkSync(file);
console.log("split", relOld, "->", outFiles.length, "files");
