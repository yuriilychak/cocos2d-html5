#!/usr/bin/env python3
"""Pass 1: Build a symbol table for cocostudio.

Scans every .js file in packages/cocostudio/src (excluding index.js and
setup.js) and finds:
  - All ES `export` declarations (class/function/const/var/let).
  - All top-level `ccs.IDENT = ...` assignments — these are symbols that
    need to migrate to ES exports + a centralised assignment block in
    index.js.

Outputs a single JSON document on stdout:
  {
    "symbols": { "IDENT": "<file>", ... },   # symbol -> defining file
    "kinds":   { "IDENT": "class|function|const|patch|seed", ... },
    "files":   { "<file>": ["IDENT", ...] }, # in declaration order
  }
"""
from __future__ import annotations
import json, os, re, sys, glob

SRC = "packages/cocostudio/src"
SKIP = {"index.js", "setup.js"}

EXPORT_RE = re.compile(
    r"^export\s+(?:default\s+)?(class|function|const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)"
)
# top-level ccs.X = ... (X is a bare identifier, no further dotted access on LHS)
ASSIGN_RE = re.compile(r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(.*)$")
# top-level ccs.X.Y... = ... (a "patch" — assigning onto an existing symbol)
PATCH_RE = re.compile(r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\.[A-Za-z_$]")


def scan(path: str):
    text = open(path).read()
    syms_in_file: list[tuple[str, str]] = []  # (ident, kind)
    # Walk lines; only top-level (no leading whitespace) lines are considered.
    for raw in text.splitlines():
        if raw and raw[0] in (" ", "\t"):
            continue
        m = EXPORT_RE.match(raw)
        if m:
            kind, name = m.group(1), m.group(2)
            syms_in_file.append((name, kind))
            continue
        m = ASSIGN_RE.match(raw)
        if m:
            name = m.group(1)
            rhs = m.group(2).rstrip()
            # Determine kind from RHS (best-effort)
            if rhs.startswith("class "):
                kind = "class"
            elif rhs.startswith("function"):
                kind = "function"
            elif rhs.startswith("{"):
                kind = "object"
            else:
                kind = "const"
            syms_in_file.append((name, kind))
            continue
        m = PATCH_RE.match(raw)
        if m:
            # patch onto an existing symbol — record nothing new but mark.
            syms_in_file.append((m.group(1), "patch"))
            continue
    return syms_in_file


def main() -> int:
    files = sorted(
        f for f in glob.glob(f"{SRC}/*.js")
        if os.path.basename(f) not in SKIP
    )
    symbols: dict[str, str] = {}
    kinds:   dict[str, str] = {}
    by_file: dict[str, list[str]] = {}
    conflicts: list[tuple[str, str, str]] = []

    for path in files:
        rel = os.path.relpath(path, SRC)
        seen_in_file: list[str] = []
        for name, kind in scan(path):
            if kind == "patch":
                continue
            if name in symbols and symbols[name] != rel:
                conflicts.append((name, symbols[name], rel))
                continue
            if name not in symbols:
                symbols[name] = rel
                kinds[name] = kind
                seen_in_file.append(name)
            else:
                # same file, possibly an `export const X = ccs.X = ...` pair
                if kind in ("class", "function") and kinds.get(name) == "const":
                    kinds[name] = kind
        by_file[rel] = seen_in_file

    out = {
        "symbols": symbols,
        "kinds":   kinds,
        "files":   by_file,
        "conflicts": conflicts,
    }
    json.dump(out, sys.stdout, indent=2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
