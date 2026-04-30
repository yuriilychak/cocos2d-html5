#!/usr/bin/env python3
"""Transform every cocostudio source file in place.

Phase 1 — top-level rewrites
  * `export const X = ccs.X = REST;`        -> `export const X = REST;`
  * `ccs.X = X;`            (X owned here)  -> drop the line
  * `ccs.X = REST` (top-level, X owned)     -> `export const X = REST` (preserve trailing)
  * `ccs.X = class X extends Y {` ...       -> `export class X extends Y {`
  * `ccs.X = function (...) {` ...          -> `export const X = function (...) {`
  * `ccs.Foo.bar = ...`     (top-level)     -> `Foo.bar = ...`

Phase 2 — body rewrites
  * Replace any non-comment occurrence of `ccs.X` with `X` when X is a known
    cocostudio symbol or a known external (Node, Sprite, Component, _load,
    PI). Track which external symbols each file uses for import injection.

Phase 3 — import injection
  * For every external sibling-file or @aspect/core symbol referenced after
    the body rewrite, add a corresponding `import { ... } from "..."` to the
    top of the file (after the licence header / existing imports).
"""
from __future__ import annotations
import json, os, re, sys, glob
from collections import defaultdict

SRC = "packages/cocostudio/src"
SKIP = {"index.js", "setup.js"}

# Identifiers that aren't defined inside the cocostudio package but are used
# via `ccs.X` from the legacy global namespace.  Map to (module, importName).
EXTERNALS = {
    "Node":      ("@aspect/core", "Node"),
    "Sprite":    ("@aspect/core", "Sprite"),
    "Component": ("@aspect/core", "Component"),
}
# `ccs.PI` is referenced but never defined; legacy used `Math.PI`.  Replace.
PI_REPLACE = ("Math.PI", None)

with open(".refactor/symbols.json") as f:
    SYM = json.load(f)
SYMBOLS: dict[str, str] = SYM["symbols"]
KINDS:   dict[str, str] = SYM["kinds"]

# ---- regular expressions -----------------------------------------------------

EXPORT_ASSIGN_CCS_RE = re.compile(
    r"^(export\s+(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*)ccs\.\2\s*=\s*"
)
DROP_RE = re.compile(r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*\1\s*;\s*$")
CCS_X_CLASS_RE = re.compile(
    r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*class\s+\1\s+extends\s+(.+?)\s*\{(.*)$"
)
CCS_X_CLASS_NOEXT_RE = re.compile(
    r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*class\s+\1\s*\{(.*)$"
)
CCS_ASSIGN_RE = re.compile(r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*")
CCS_PATCH_RE  = re.compile(r"^ccs\.([A-Za-z_$][A-Za-z0-9_$]*)(\.[A-Za-z_$])")

# Match every `ccs.IDENT` reference in source code.  Comment stripping is
# handled separately at the line/block level.
CCS_REF_RE = re.compile(r"\bccs\.([A-Za-z_$][A-Za-z0-9_$]*)\b")


def is_comment_only(line: str, in_block: bool) -> tuple[bool, bool]:
    """Return (is_comment_only, in_block_after).  Used to skip pure-comment
    lines while keeping block-comment state across calls."""
    s = line.strip()
    if in_block:
        if "*/" in s:
            # comment ends here; the rest of the line is code in principle,
            # but for our heuristic we treat the line as comment.
            return True, False
        return True, True
    if s.startswith("/*"):
        if "*/" in s[2:]:
            return True, False
        return True, True
    if s.startswith("//") or s.startswith("*"):
        return True, False
    return False, False


def strip_inline_comments(line: str) -> str:
    """Return a copy of `line` with `// ...` and `/* ... */` substrings
    blanked out so regexes don't match inside them.  Preserves length."""
    out = list(line)
    i = 0
    n = len(line)
    in_str = None  # quote char if inside string
    while i < n:
        c = line[i]
        if in_str:
            if c == "\\" and i + 1 < n:
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c in ("'", '"', "`"):
            in_str = c
            i += 1
            continue
        if c == "/" and i + 1 < n:
            nxt = line[i + 1]
            if nxt == "/":
                for j in range(i, n):
                    out[j] = " "
                break
            if nxt == "*":
                end = line.find("*/", i + 2)
                if end == -1:
                    end = n
                else:
                    end += 2
                for j in range(i, end):
                    out[j] = " "
                i = end
                continue
        i += 1
    return "".join(out)


def transform_file(path: str) -> dict:
    rel = os.path.basename(path)
    src = open(path).read()
    lines = src.split("\n")
    out: list[str] = []
    in_block = False  # inside /* */
    used_externals: dict[str, set[str]] = defaultdict(set)  # rel_path|module -> {names}
    dropped = 0
    converted = 0

    for raw in lines:
        is_comment, in_block = is_comment_only(raw, in_block)
        if is_comment:
            out.append(raw)
            continue

        # Phase 1 top-level transforms (only when line starts at column 0,
        # i.e. no leading whitespace).
        if raw and raw[0] not in (" ", "\t"):
            # 1. drop self-export `ccs.X = X;`
            m = DROP_RE.match(raw)
            if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                dropped += 1
                continue
            # 2. `export const X = ccs.X = REST;` -> `export const X = REST;`
            m = EXPORT_ASSIGN_CCS_RE.match(raw)
            if m:
                raw = EXPORT_ASSIGN_CCS_RE.sub(r"\1", raw)
                converted += 1
            else:
                # 3a. class with extends
                m = CCS_X_CLASS_RE.match(raw)
                if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                    name, parent, tail = m.group(1), m.group(2), m.group(3)
                    raw = f"export class {name} extends {parent} {{{tail}"
                    converted += 1
                else:
                    m = CCS_X_CLASS_NOEXT_RE.match(raw)
                    if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                        name, tail = m.group(1), m.group(2)
                        raw = f"export class {name} {{{tail}"
                        converted += 1
                    else:
                        # 3b. generic ccs.X = REST -> export const X = REST
                        m = CCS_ASSIGN_RE.match(raw)
                        if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                            raw = CCS_ASSIGN_RE.sub(
                                lambda mm: f"export const {mm.group(1)} = ", raw, count=1
                            )
                            converted += 1
                        else:
                            # 4. patch like `ccs.Foo.bar = ...` -> `Foo.bar = ...`
                            m = CCS_PATCH_RE.match(raw)
                            if m:
                                name = m.group(1)
                                if name in SYMBOLS and SYMBOLS[name] != rel:
                                    used_externals[SYMBOLS[name]].add(name)
                                if name in EXTERNALS:
                                    mod, imp = EXTERNALS[name]
                                    used_externals[mod].add(imp)
                                raw = "ccs." .__class__  # noqa  (placeholder)
                                # do the substitution
                                raw = CCS_PATCH_RE.sub(
                                    lambda mm: f"{mm.group(1)}{mm.group(2)}",
                                    lines_buf := (raw if False else None) or (None),
                                    count=0,
                                )
                                # easier: just strip "ccs." from beginning
                                raw_line = lines[len(out)] if False else None
                                # Recompute deterministically:
                                raw = re.sub(r"^ccs\.", "", _orig := lines[lines_idx_holder["i"]]) if False else None
        # The hacky branch above is unreachable; proper handling below.
        out.append(raw if raw is not None else "")

    return {"text": "\n".join(out), "ext": used_externals, "dropped": dropped, "converted": converted}


# The function above became messy mid-edit.  Use the cleaner implementation.
def transform_file(path: str) -> dict:  # noqa: F811  (intentional)
    rel = os.path.basename(path)
    src = open(path).read()
    lines = src.split("\n")
    out: list[str] = []
    in_block = False
    used_externals: dict[str, set[str]] = defaultdict(set)
    dropped = 0
    converted = 0
    used_self_imports: set[str] = set()

    for raw in lines:
        is_comment, in_block = is_comment_only(raw, in_block)
        if is_comment:
            out.append(raw)
            continue

        if raw and raw[0] not in (" ", "\t"):
            m = DROP_RE.match(raw)
            if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                dropped += 1
                continue
            m = EXPORT_ASSIGN_CCS_RE.match(raw)
            if m:
                raw = EXPORT_ASSIGN_CCS_RE.sub(r"\1", raw)
                converted += 1
            else:
                m = CCS_X_CLASS_RE.match(raw)
                if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                    name, parent, tail = m.group(1), m.group(2), m.group(3)
                    raw = f"export class {name} extends {parent} {{{tail}"
                    converted += 1
                else:
                    m = CCS_X_CLASS_NOEXT_RE.match(raw)
                    if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                        name, tail = m.group(1), m.group(2)
                        raw = f"export class {name} {{{tail}"
                        converted += 1
                    else:
                        m = CCS_ASSIGN_RE.match(raw)
                        if m and m.group(1) in SYMBOLS and SYMBOLS[m.group(1)] == rel:
                            name = m.group(1)
                            raw = CCS_ASSIGN_RE.sub(
                                f"export const {name} = ", raw, count=1
                            )
                            converted += 1
                        else:
                            m = CCS_PATCH_RE.match(raw)
                            if m:
                                raw = re.sub(r"^ccs\.", "", raw, count=1)
                                converted += 1

        # Phase 2 body rewrites — only on non-comment regions of the line.
        # Use strip_inline_comments to mask comment text so we don't replace
        # ccs.X inside `// ...` or `/* ... */`.
        masked = strip_inline_comments(raw)
        new_chars = list(raw)
        for m in CCS_REF_RE.finditer(masked):
            name = m.group(1)
            if name in SYMBOLS:
                owner = SYMBOLS[name]
                if owner != rel:
                    used_externals[owner].add(name)
                else:
                    used_self_imports.add(name)
                # Replace `ccs.NAME` with `NAME` (preserve length unimportant
                # here; we mutate raw via slicing).
                start, end = m.start(), m.end()
                new_chars[start:end] = list(name)
            elif name in EXTERNALS:
                mod, imp = EXTERNALS[name]
                used_externals[mod].add(imp)
                start, end = m.start(), m.end()
                new_chars[start:end] = list(name) if name == imp else list(imp)
            elif name == "PI":
                # ccs.PI -> Math.PI
                start, end = m.start(), m.end()
                new_chars[start:end] = list("Math.PI")
        # Reconstruct the line.  The slice assignment above may shift indices;
        # to avoid that, rebuild from the masked positions in reverse order.
        new_chars = list(raw)
        for m in reversed(list(CCS_REF_RE.finditer(masked))):
            name = m.group(1)
            replacement: str | None = None
            if name in SYMBOLS:
                replacement = name
            elif name in EXTERNALS:
                replacement = EXTERNALS[name][1]
            elif name == "PI":
                replacement = "Math.PI"
            if replacement is not None:
                start, end = m.start(), m.end()
                new_chars[start:end] = list(replacement)
        raw = "".join(new_chars)
        out.append(raw)

    return {
        "text": "\n".join(out),
        "ext": used_externals,
        "dropped": dropped,
        "converted": converted,
    }


# ---- import injection --------------------------------------------------------

IMPORT_FROM_RE = re.compile(
    r'^import\s+(?:\*\s+as\s+\w+|\{([^}]*)\}|\w+)\s+from\s+["\']([^"\']+)["\']\s*;?\s*$'
)


def inject_imports(text: str, ext: dict[str, set[str]], cur_rel: str) -> str:
    """Add or extend `import` statements so every external symbol used by the
    transformed file is brought into scope.  Existing imports from the same
    module are extended, otherwise a fresh import is inserted near the top."""
    if not ext:
        return text

    lines = text.split("\n")
    # Find existing import lines and their positions.
    existing: dict[str, tuple[int, set[str]]] = {}
    last_import_line = -1
    for i, ln in enumerate(lines):
        m = IMPORT_FROM_RE.match(ln.strip())
        if m:
            names_part, mod = m.group(1), m.group(2)
            names = set()
            if names_part:
                for n in names_part.split(","):
                    n = n.strip()
                    if n:
                        # handle `Foo as Bar` -> we care about local binding (Bar)
                        names.add(n.split(" as ")[-1].strip())
            existing[mod] = (i, names)
            last_import_line = i

    # Determine where to insert new imports if needed (after the licence
    # comment + any existing imports).  If there are no imports, place after
    # the first comment block.
    insert_at = last_import_line + 1
    if insert_at == 0:
        in_block = False
        for i, ln in enumerate(lines):
            s = ln.strip()
            if not in_block and s.startswith("/*"):
                in_block = "*/" not in s[2:]
                continue
            if in_block:
                if "*/" in s:
                    in_block = False
                continue
            if s.startswith("//") or s.startswith("*") or s == "":
                continue
            insert_at = i
            break

    # Build module spec: source path -> (sorted names)
    new_imports: list[tuple[str, list[str]]] = []
    for owner, names in sorted(ext.items()):
        if owner.endswith(".js"):
            mod = f"./{owner}"
        else:
            mod = owner  # e.g. "@aspect/core"
        if mod in existing:
            idx, have = existing[mod]
            need = sorted(names - have)
            if not need:
                continue
            ln = lines[idx]
            m = IMPORT_FROM_RE.match(ln.strip())
            if m and m.group(1) is not None:
                # extend existing braces
                inside = m.group(1).strip().rstrip(",")
                merged = sorted({s.strip() for s in inside.split(",") if s.strip()} | set(need))
                lines[idx] = re.sub(
                    r"\{[^}]*\}",
                    "{ " + ", ".join(merged) + " }",
                    ln,
                    count=1,
                )
            else:
                new_imports.append((mod, sorted(need)))
        else:
            new_imports.append((mod, sorted(names)))

    if new_imports:
        block = [
            f'import {{ {", ".join(names)} }} from "{mod}";'
            for mod, names in new_imports
        ]
        lines[insert_at:insert_at] = block + ([""] if lines[insert_at:insert_at + 1] != [""] else [])

    return "\n".join(lines)


def main() -> int:
    files = sorted(
        f for f in glob.glob(f"{SRC}/*.js")
        if os.path.basename(f) not in SKIP
    )
    summary = []
    for path in files:
        rel = os.path.basename(path)
        result = transform_file(path)
        text = inject_imports(result["text"], result["ext"], rel)
        # Do not write if unchanged.
        original = open(path).read()
        if text != original:
            with open(path, "w") as f:
                f.write(text)
        summary.append((rel, result["dropped"], result["converted"], dict(result["ext"])))

    for rel, d, c, ext in summary:
        ext_brief = {k: len(v) for k, v in ext.items()}
        print(f"{rel:42s}  dropped={d:3d}  converted={c:3d}  imports={ext_brief}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
