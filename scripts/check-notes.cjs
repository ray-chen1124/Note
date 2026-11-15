"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const catalog = fs.readFileSync(path.join(root, "notes", "catalog.js"), "utf8");
const notes = vm.runInNewContext(catalog + "\nnotes;", {}, { timeout: 1000 });

function requireText(value, label) {
  assert(typeof value === "string" && value.trim(), label + " 必須是非空文字");
}

function requireTextArray(value, label) {
  assert(Array.isArray(value) && value.length > 0, label + " 必須是非空陣列");
  for (const entry of value) requireText(entry, label);
}

assert(Array.isArray(notes) && notes.length > 0, "目錄至少需要一篇筆記");
const slugs = new Set();
for (const note of notes) {
  const { slug, example } = note;
  assert(typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), "無效的 slug " + slug);
  assert(!slugs.has(slug), "重複的 slug " + slug);
  slugs.add(slug);
  for (const key of ["category", "title", "summary", "concept", "formula", "condition", "pitfall"]) {
    requireText(note[key], slug + "." + key);
  }
  assert(note.category === note.category.trim() && note.category !== "全部", slug + " 的分類無效");
  requireTextArray(note.keywords, slug + ".keywords");
  assert(example && typeof example === "object", slug + ".example 必須存在");
  requireText(example.question, slug + ".example.question");
  requireTextArray(example.steps, slug + ".example.steps");
  requireText(example.answer, slug + ".example.answer");
}
console.log(`格式驗證通過，共 ${notes.length} 篇筆記。`);
