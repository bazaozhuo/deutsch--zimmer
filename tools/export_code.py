#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把网站源码导出成「老师能看」的形式。

输出（默认到 ../../代码汇总/，即桌面/网页作业/代码汇总/）：
  01-HTML/            5 个页面
  02-CSS/             样式表
  03-JavaScript/      脚本与词表数据
  全部代码.md          所有源码合并成一份文件（带目录、按语言标注）
  开发过程.md           Git 提交历史（哪天、改了什么、多少行）
  README.md            文件说明 + 在 VS Code 里怎么打开
  代码汇总.code-workspace   一打开就是 HTML / CSS / JS 三个分区

用法：python3 tools/export_code.py [输出目录]
"""
from __future__ import annotations

import datetime as dt
import os
import shutil
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT = os.path.join(os.path.dirname(REPO), "代码汇总")

# 按后缀分组：顺序就是给人看的顺序
GROUPS: list[tuple[str, str, str, list[str]]] = [
    ("01-HTML", "HTML", "html", [
        "index.html", "lernen.html", "vokabeln.html", "notizen.html", "kontakt.html",
    ]),
    ("02-CSS", "CSS", "css", ["css/style.css"]),
    ("03-JavaScript", "JavaScript", "javascript", [
        "js/i18n.js", "js/vokabeln-data.js", "js/vokabeln-data-b1.js",
        "js/vokabeln-data-b1-2.js", "js/vokabeln.js", "js/kontakt.js",
    ]),
]

ROLE = {
    "index.html": "首页：为什么做这个站、我的进度、每周时间表、插图",
    "lernen.html": "学习方法：材料、四条学习线、A2→B1 语法清单、踩过的坑",
    "vokabeln.html": "词汇表：搜索框 + 词类/主题两组筛选 + 表格骨架",
    "notizen.html": "我的笔记：听写练习原文与订正、词表来源",
    "kontakt.html": "联系页：表单（浏览器原生校验）",
    "css/style.css": "全站样式：颜色变量、字号层级、表格、表单、响应式媒体查询",
    "js/i18n.js": "中英切换：英文词典 + 中文原文快照 + localStorage / ?lang=en",
    "js/vokabeln-data.js": "词表数据第 1 份：我课本笔记里的 107 个词",
    "js/vokabeln-data-b1.js": "词表数据第 2 份：B1 高频词 50 个",
    "js/vokabeln-data-b1-2.js": "词表数据第 3 份：B1 高频词 46 个",
    "js/vokabeln.js": "词汇表逻辑：合并三份数据、搜索、双重筛选、按语言重渲染",
    "js/kontakt.js": "联系表单：拦下默认提交、调浏览器校验、显示确认信息",
}


def read(rel: str) -> str:
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return f.read()


def line_count(text: str) -> int:
    return len(text.splitlines())


def write(path: str, text: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def git(*args: str) -> str:
    try:
        return subprocess.run(
            ["git", "-C", REPO, *args], capture_output=True, text=True, check=True
        ).stdout.strip()
    except Exception:
        return ""


def build_all_code_md() -> str:
    today = dt.date.today().isoformat()
    total_lines = 0
    parts: list[str] = []

    # 目录
    toc = ["## 目录", ""]
    n = 0
    for folder, label, _lang, files in GROUPS:
        toc.append(f"**{label}**")
        toc.append("")
        for rel in files:
            n += 1
            lines = line_count(read(rel))
            total_lines += lines
            toc.append(f"{n}. `{rel}` —— {lines} 行 · {ROLE.get(rel, '')}")
        toc.append("")

    parts.append("# 网页作业 · 全部代码")
    parts.append("")
    parts.append(f"> 由 `tools/export_code.py` 于 {today} 从仓库导出。"
                 f"共 {len([f for _, _, _, fs in GROUPS for f in fs])} 个文件、约 {total_lines} 行。")
    parts.append("> 实际开发在 `../website/`，这里是给老师看的副本；改代码请改仓库，再重新导出。")
    parts.append("")
    parts.extend(toc)
    parts.append("---")
    parts.append("")

    n = 0
    for _folder, label, lang, files in GROUPS:
        parts.append(f"## {label}")
        parts.append("")
        for rel in files:
            n += 1
            text = read(rel)
            parts.append(f"### {n}. `{rel}`（{line_count(text)} 行）")
            parts.append("")
            parts.append(f"*{ROLE.get(rel, '')}*")
            parts.append("")
            parts.append(f"```{lang}")
            parts.append(text.rstrip("\n"))
            parts.append("```")
            parts.append("")

    return "\n".join(parts)


def build_process_md() -> str:
    raw = git("log", "--reverse", "--pretty=format:%h%x09%ad%x09%s", "--date=format:%Y-%m-%d %H:%M")
    rows = [r.split("\t") for r in raw.splitlines() if r.strip()]
    total = len(rows)
    if total >= 2:
        first, last = rows[0][1][:10], rows[-1][1][:10]
        span = f"{first} → {last}"
    else:
        span = "—"

    out = [
        "# 开发过程（Git 提交记录）",
        "",
        f"共 **{total} 次提交**，时间跨度 {span}。",
        "",
        "> 这些记录可以用 `git log --stat` 或仓库的 Commits 页面随时复核：",
        "> https://github.com/bazaozhuo/my-website/commits/main",
        "",
        "## 提交清单",
        "",
        "| # | 时间 | 提交信息 |",
        "| --- | --- | --- |",
    ]
    for i, (sha, when, subject) in enumerate(rows, 1):
        out.append(f"| {i} | {when} | `{sha}` {subject} |")

    out += ["", "## 每次提交改了什么", ""]
    for sha, when, subject in rows:
        stat = git("show", "--stat", "--format=", "--oneline", sha)
        out.append(f"### `{sha}` {subject}")
        out.append("")
        out.append(f"时间：{when}")
        out.append("")
        out.append("```")
        out.append(stat.strip() or "(无文件改动)")
        out.append("```")
        out.append("")

    # 按天汇总
    per_day: dict[str, int] = {}
    for _sha, when, _s in rows:
        per_day[when[:10]] = per_day.get(when[:10], 0) + 1
    out += ["## 按天汇总", "", "| 日期 | 提交次数 |", "| --- | --- |"]
    for day in sorted(per_day):
        out.append(f"| {day} | {per_day[day]} |")
    out.append("")
    return "\n".join(out)


def build_readme(out_dir: str) -> str:
    lines = [
        "# 代码汇总（给老师看用）",
        "",
        "这里是网站的**完整源代码副本**，按文件后缀分成三块，方便在 VS Code 里讲。",
        "",
        "## 怎么打开",
        "",
        "1. 双击 `代码汇总.code-workspace`（或在 VS Code 里 File → Open Workspace from File…）",
        "2. 左侧会出现 **HTML / CSS / JavaScript** 三个分区，点开就能看到文件",
        "",
        "不想用 workspace 也行：VS Code 里 File → Open Folder → 选这个文件夹。",
        "",
        "## 目录",
        "",
        "```",
    ]
    for folder, label, _lang, files in GROUPS:
        lines.append(f"{folder}/")
        for rel in files:
            lines.append(f"    {os.path.basename(rel):28} {line_count(read(rel)):>4} 行   {ROLE.get(rel, '')}")
        lines.append("")
    lines += [
        "全部代码.md      所有源码合并成一份（带目录）",
        "全部代码.docx    同上，Word 版（可投屏/打印）",
        "开发过程.md      Git 提交历史：哪天提交、改了什么、多少行",
        "```",
        "",
        "## 说明",
        "",
        "- 这些是**导出副本**，实际开发在 `../website/`（有 `.git`）。改代码请改仓库，然后重新运行",
        "  `python3 tools/export_code.py` 更新这里。",
        "- 线上网址：https://bazaozhuo.github.io/my-website/",
        "- 词表数据分三个文件，是因为单个文件超过 15KB 不好读；渲染时由 `js/vokabeln.js` 合并。",
        "",
    ]
    return "\n".join(lines)


def build_workspace(out_dir: str) -> str:
    def entry(name: str, path: str) -> str:
        return '      {"name": "%s", "path": "%s"}' % (name, path)

    return """{
  "folders": [
%s
  ],
  "settings": {
    "explorer.sortOrder": "type",
    "files.encoding": "utf8"
  }
}
""" % ",\n".join([
        entry("HTML", "01-HTML"),
        entry("CSS", "02-CSS"),
        entry("JavaScript", "03-JavaScript"),
    ])


def main() -> None:
    out_dir = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    if os.path.isdir(out_dir):
        shutil.rmtree(out_dir)
    os.makedirs(out_dir)

    # 1) 按后缀分组的副本
    copied = 0
    for folder, _label, _lang, files in GROUPS:
        for rel in files:
            dest = os.path.join(out_dir, folder, os.path.basename(rel))
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(os.path.join(REPO, rel), encoding="utf-8") as src, \
                    open(dest, "w", encoding="utf-8", newline="\n") as dst:
                dst.write(src.read())
            copied += 1

    # 2) 合并文档 + 过程 + 说明 + workspace
    all_md = build_all_code_md()
    process_md = build_process_md()
    write(os.path.join(out_dir, "全部代码.md"), all_md)
    write(os.path.join(out_dir, "开发过程.md"), process_md)
    # 老师要看的那一份：代码 + 过程合在一起
    write(os.path.join(out_dir, "代码与过程.md"), all_md + "\n\n---\n\n" + process_md)
    write(os.path.join(out_dir, "README.md"), build_readme(out_dir))
    write(os.path.join(out_dir, "代码汇总.code-workspace"), build_workspace(out_dir))

    total_lines = sum(line_count(read(rel)) for _f, _l, _g, fs in GROUPS for rel in fs)
    print(f"导出完成 → {out_dir}")
    print(f"  文件 {copied} 个，约 {total_lines} 行")
    print(f"  全部代码.md {line_count(all_md)} 行")


if __name__ == "__main__":
    main()
