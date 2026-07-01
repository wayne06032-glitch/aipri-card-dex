from __future__ import annotations

import json
import os
from pathlib import Path

from PIL import Image


SOURCE_ENV = "AIPRI_UI_BOARD_SOURCE"
OUTPUT_ROOT = Path(
    r"C:\Users\User.DESKTOP-G0LEPLM\Documents\Codex\2026-05-01\files-mentioned-by-the-user-aipri\ui-materials-usable"
)


ASSETS = [
    {
        "category": "backgrounds",
        "name": "bg_main_strip",
        "label": "主背景條",
        "box": (18, 64, 414, 168),
        "transparent": False,
    },
    {
        "category": "backgrounds",
        "name": "header_bg_strip",
        "label": "Header 背景條",
        "box": (18, 198, 411, 247),
        "transparent": False,
    },
    {
        "category": "backgrounds",
        "name": "panel_bg_large",
        "label": "大面板背景",
        "box": (18, 273, 412, 383),
        "transparent": False,
    },
    {
        "category": "backgrounds",
        "name": "panel_bg_small",
        "label": "小面板背景",
        "box": (18, 386, 219, 453),
        "transparent": False,
    },
    {
        "category": "backgrounds",
        "name": "modal_bg_strip",
        "label": "彈窗背景條",
        "box": (232, 386, 407, 453),
        "transparent": False,
    },
    {
        "category": "frames",
        "name": "card_detail_frame",
        "label": "卡片詳細大框",
        "box": (660, 76, 900, 308),
        "transparent": False,
    },
    {
        "category": "frames",
        "name": "modal_frame_large",
        "label": "彈窗大框",
        "box": (951, 553, 1171, 811),
        "transparent": False,
    },
    {
        "category": "frames",
        "name": "stats_ring_block",
        "label": "圓環統計區塊",
        "box": (709, 520, 921, 649),
        "transparent": False,
    },
    {
        "category": "buttons",
        "name": "filter_button_apply",
        "label": "套用篩選按鈕",
        "box": (1108, 286, 1367, 358),
        "transparent": False,
    },
    {
        "category": "buttons",
        "name": "filter_button_reset",
        "label": "重置按鈕",
        "box": (951, 286, 1068, 357),
        "transparent": False,
    },
    {
        "category": "buttons",
        "name": "modal_title_join_collection",
        "label": "加入收藏標題條",
        "box": (1190, 528, 1514, 607),
        "transparent": True,
        "white_threshold": 245,
    },
    {
        "category": "buttons",
        "name": "modal_button_cancel",
        "label": "取消按鈕",
        "box": (1190, 620, 1309, 686),
        "transparent": False,
    },
    {
        "category": "buttons",
        "name": "modal_button_confirm",
        "label": "確認加入按鈕",
        "box": (1318, 620, 1514, 686),
        "transparent": False,
    },
    {
        "category": "buttons",
        "name": "status_badges_strip",
        "label": "狀態 Badge 列",
        "box": (951, 383, 1514, 458),
        "transparent": False,
    },
    {
        "category": "icons",
        "name": "header_icon_back",
        "label": "返回 icon",
        "box": (17, 590, 81, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "header_icon_menu",
        "label": "選單 icon",
        "box": (88, 590, 151, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "header_icon_search",
        "label": "搜尋 icon",
        "box": (158, 590, 222, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "header_icon_heart_outline",
        "label": "空心收藏 icon",
        "box": (229, 590, 292, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "header_icon_heart_fill",
        "label": "實心收藏 icon",
        "box": (299, 590, 362, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "header_icon_refresh",
        "label": "重置 icon",
        "box": (367, 590, 431, 655),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "bottom_nav_library",
        "label": "底部導覽 圖鑑",
        "box": (69, 726, 154, 821),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "bottom_nav_favorite",
        "label": "底部導覽 收藏",
        "box": (166, 726, 251, 821),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "bottom_nav_stats",
        "label": "底部導覽 統計",
        "box": (265, 726, 348, 821),
        "transparent": True,
    },
    {
        "category": "icons",
        "name": "bottom_nav_more",
        "label": "底部導覽 更多",
        "box": (362, 726, 431, 821),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "gem_heart_main",
        "label": "主愛心水晶",
        "box": (26, 885, 96, 973),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "gem_rhombus_left",
        "label": "左菱形水晶",
        "box": (111, 888, 159, 974),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "gem_rhombus_mid",
        "label": "中菱形水晶",
        "box": (166, 887, 203, 975),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "gem_rhombus_right",
        "label": "右菱形水晶",
        "box": (206, 886, 256, 974),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "gem_small_drop",
        "label": "小型吊墜水晶",
        "box": (141, 964, 179, 1008),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_gold_large",
        "label": "大型金星",
        "box": (286, 882, 344, 943),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_pink_sparkle",
        "label": "粉色星光",
        "box": (344, 885, 403, 934),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_gold_right",
        "label": "右金星",
        "box": (401, 882, 458, 943),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_blue_left",
        "label": "藍星",
        "box": (286, 945, 344, 1001),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_violet_center",
        "label": "紫星",
        "box": (344, 946, 402, 1002),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "star_sparkle_cluster",
        "label": "星點群",
        "box": (397, 946, 463, 1002),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "heart_cluster_pink",
        "label": "粉愛心群",
        "box": (541, 885, 617, 950),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "heart_cluster_blue",
        "label": "藍愛心群",
        "box": (617, 885, 672, 950),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "heart_outline_large",
        "label": "大愛心框",
        "box": (675, 882, 731, 950),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "bow_main",
        "label": "蝴蝶結",
        "box": (683, 934, 756, 1007),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "triangle_main",
        "label": "主三角裝飾",
        "box": (803, 929, 880, 1002),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "geometry_cluster",
        "label": "幾何碎片群",
        "box": (781, 886, 965, 1003),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_pink_left",
        "label": "左粉光",
        "box": (987, 887, 1068, 969),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_purple_ring",
        "label": "紫色光環",
        "box": (1063, 885, 1149, 971),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_white_orb",
        "label": "白色光球",
        "box": (1148, 886, 1210, 968),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_orange_orb",
        "label": "橘色光球",
        "box": (986, 967, 1068, 1012),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_pink_ring_small",
        "label": "粉色小光環",
        "box": (1066, 969, 1148, 1012),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "glow_cyan_orb",
        "label": "青色光球",
        "box": (1149, 968, 1210, 1011),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "crown_main",
        "label": "皇冠",
        "box": (1236, 906, 1304, 961),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "wing_left",
        "label": "左翅膀",
        "box": (1312, 905, 1372, 961),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "side_gem_purple",
        "label": "紫色側飾",
        "box": (1380, 905, 1440, 961),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "ribbon_main",
        "label": "緞帶",
        "box": (1231, 957, 1418, 1008),
        "transparent": True,
    },
    {
        "category": "decor",
        "name": "frame_circle",
        "label": "圓形花框",
        "box": (1422, 885, 1512, 1008),
        "transparent": True,
    },
]


def make_transparent(image: Image.Image, threshold: int = 248, softness: int = 18) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = []
    for red, green, blue, alpha in rgba.getdata():
        whiteness = min(red, green, blue)
        if whiteness >= threshold:
            pixels.append((red, green, blue, 0))
            continue

        if whiteness >= threshold - softness:
            ratio = (threshold - whiteness) / max(1, softness)
            next_alpha = int(alpha * ratio)
            pixels.append((red, green, blue, next_alpha))
            continue

        pixels.append((red, green, blue, alpha))

    rgba.putdata(pixels)
    return trim_transparent(rgba)


def trim_transparent(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image
    return image.crop(bbox)


def save_asset(source: Image.Image, spec: dict) -> dict:
    category_dir = OUTPUT_ROOT / spec["category"]
    category_dir.mkdir(parents=True, exist_ok=True)

    cropped = source.crop(spec["box"])
    if spec.get("transparent", False):
        cropped = make_transparent(
            cropped,
            threshold=spec.get("white_threshold", 248),
            softness=spec.get("softness", 18),
        )

    output_path = category_dir / f"{spec['name']}.png"
    cropped.save(output_path)

    width, height = cropped.size
    return {
        "category": spec["category"],
        "name": spec["name"],
        "label": spec["label"],
        "file": str(output_path),
        "size": {"width": width, "height": height},
        "source_box": {
            "left": spec["box"][0],
            "top": spec["box"][1],
            "right": spec["box"][2],
            "bottom": spec["box"][3],
        },
        "transparent": spec.get("transparent", False),
    }


def build_preview(manifest: list[dict]) -> None:
    html_parts = [
        "<!DOCTYPE html>",
        "<html lang='zh-Hant'>",
        "<head>",
        "<meta charset='UTF-8' />",
        "<meta name='viewport' content='width=device-width, initial-scale=1' />",
        "<title>UI Materials Preview</title>",
        "<style>",
        "body{font-family:'Segoe UI','Noto Sans TC',sans-serif;background:#faf5ff;color:#4b3869;margin:0;padding:24px;}",
        "h1{margin:0 0 8px;} h2{margin:28px 0 12px;}",
        ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;}",
        ".card{background:white;border:1px solid #eadcff;border-radius:18px;padding:12px;box-shadow:0 10px 24px rgba(128,88,181,.08);}",
        ".thumb{display:grid;place-items:center;min-height:110px;padding:10px;border-radius:14px;background:linear-gradient(180deg,#fff,#fcf6ff);background-image:radial-gradient(circle at top left,rgba(255,204,233,.42),transparent 35%),radial-gradient(circle at bottom right,rgba(196,206,255,.35),transparent 32%);}",
        ".thumb img{max-width:100%;max-height:140px;}",
        ".meta{margin-top:10px;font-size:12px;line-height:1.5;word-break:break-word;}",
        ".path{color:#8b79aa;}",
        "</style>",
        "</head>",
        "<body>",
        "<h1>UI 素材預覽</h1>",
        "<p>這批素材已細拆並依用途分類，可直接挑路徑掛到 PWA。</p>",
    ]

    for category in sorted({item["category"] for item in manifest}):
        html_parts.append(f"<h2>{category}</h2>")
        html_parts.append("<div class='grid'>")
        for item in [entry for entry in manifest if entry["category"] == category]:
            rel_path = Path(item["file"]).relative_to(OUTPUT_ROOT).as_posix()
            html_parts.append(
                "<article class='card'>"
                f"<div class='thumb'><img src='{rel_path}' alt='{item['label']}' /></div>"
                f"<div class='meta'><strong>{item['name']}</strong><br />"
                f"{item['label']}<br /><span class='path'>{rel_path}</span><br />"
                f"{item['size']['width']}x{item['size']['height']}</div></article>"
            )
        html_parts.append("</div>")

    html_parts.extend(["</body>", "</html>"])
    (OUTPUT_ROOT / "preview.html").write_text("\n".join(html_parts), encoding="utf-8")


def build_readme(manifest: list[dict], source_path: Path) -> None:
    lines = [
        "# UI 素材可用版",
        "",
        f"來源圖：{source_path}",
        "",
        "## 資料夾",
        "",
        "- `backgrounds/` 背景條與面板底圖",
        "- `frames/` 框體與大區塊",
        "- `buttons/` 按鈕與標題條",
        "- `icons/` icon 與底部導覽圖示",
        "- `decor/` 可直接疊上的裝飾件",
        "",
        "## 素材清單",
        "",
    ]

    for item in manifest:
        rel_path = Path(item["file"]).relative_to(OUTPUT_ROOT).as_posix()
        lines.append(
            f"- `{rel_path}` | {item['label']} | {item['size']['width']}x{item['size']['height']}"
        )

    lines.extend(
        [
            "",
            "更多來源座標與透明設定請看 `manifest.json`。",
            "可直接開啟 `preview.html` 快速檢視所有素材。",
        ]
    )
    (OUTPUT_ROOT / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    source_path = Path(os.environ[SOURCE_ENV])
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    source = Image.open(source_path)

    manifest = [save_asset(source, spec) for spec in ASSETS]
    manifest_path = OUTPUT_ROOT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    build_readme(manifest, source_path)
    build_preview(manifest)

    print(OUTPUT_ROOT)
    print(len(manifest))


if __name__ == "__main__":
    main()
