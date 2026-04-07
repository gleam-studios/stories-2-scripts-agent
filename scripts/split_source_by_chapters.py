#!/usr/bin/env python3
"""
Split a plain-text novel into chunk files using chapter_index.json (or .yaml if PyYAML installed).

Usage:
  python3 scripts/split_source_by_chapters.py \\
    --source /path/to/novel.txt \\
    --index work/my_project/chapter_index.json \\
    --out work/my_project/source_chunks/

See examples/工作流最小样例/chapter_index.example.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None


def load_index(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    suf = path.suffix.lower()
    if suf == ".json":
        return json.loads(text)
    if suf in (".yaml", ".yml"):
        if yaml is None:
            print("Install PyYAML to use .yaml indices, or use .json.", file=sys.stderr)
            raise SystemExit(1)
        return yaml.safe_load(text)
    return json.loads(text)


def lines_slice(lines: list[str], start_line: int, end_line: int) -> str:
    return "".join(lines[start_line - 1 : end_line])


def main() -> int:
    p = argparse.ArgumentParser(description="Split source text by chapter_index.")
    p.add_argument("--source", required=True, type=Path)
    p.add_argument("--index", required=True, type=Path)
    p.add_argument("--out", required=True, type=Path)
    args = p.parse_args()

    data = load_index(args.index)
    encoding = data.get("encoding", "utf-8")
    raw = args.source.read_text(encoding=encoding)
    lines = raw.splitlines(keepends=True)

    args.out.mkdir(parents=True, exist_ok=True)

    chapters = {c["chapter_id"]: c for c in data.get("chapters", [])}
    specs = data.get("chunk_specs")

    if specs:
        for spec in specs:
            cid = spec["chunk_id"]
            parts: list[str] = []
            for chid in spec["chapter_ids"]:
                ch = chapters[chid]
                parts.append(
                    lines_slice(lines, int(ch["start_line"]), int(ch["end_line"]))
                )
            out_path = args.out / f"{str(cid).replace('/', '_')}.txt"
            out_path.write_text("".join(parts), encoding="utf-8")
            print(out_path)
    else:
        for chid, ch in sorted(
            chapters.items(), key=lambda x: int(x[1].get("start_line", 0))
        ):
            body = lines_slice(lines, int(ch["start_line"]), int(ch["end_line"]))
            out_path = args.out / f"{chid}.txt"
            out_path.write_text(body, encoding="utf-8")
            print(out_path)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
