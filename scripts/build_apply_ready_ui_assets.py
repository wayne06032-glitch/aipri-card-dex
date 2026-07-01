from __future__ import annotations

import json
import os
from pathlib import Path

from PIL import Image


SOURCE_ENV = "AIPRI_UI_BOARD_SOURCE"
ROOT = Path(
    r"C:\Users\User.DESKTOP-G0LEPLM\Documents\Codex\2026-05-01\files-mentioned-by-the-user-aipri"
)
OUT = ROOT / "ui-materials-apply-ready"


ASSETS = [
    {
        "category": "backgrounds",
        "name": "header_bg_strip",
        "label": "Header 背景條",
        "box": (18, 198, 411, 247),
        "mode": "opaque",
        "usage": "header 背景橫條，可作為 banner 背景圖",
    },
    {
        "category": "backgrounds",
        "name": "bg_sparkle_strip",
        "label": "星光背景條",
        "box": (18, 64, 414, 168),
        "mode": "opaque",
        "usage": "頁面局部星光背景，可放 hero 下層或 section 背景",
    },
    {
        "category": "overlays",
        "name": "card_detail_frame_overlay",
        "label": "卡片詳細框 overlay",
        "box": (660, 76, 900, 308),
        "mode": "light_to_alpha",
        "threshold": 242,
        "softness": 26,
        "usage": "透明疊框，適合 absolute overlay 在卡片詳細圖外層",
    },
    {
        "category": "overlays",
        "name": "modal_frame_overlay",
        "label": "彈窗大框 overlay",
        "box": (951, 553, 1171, 811),
        "mode": "light_to_alpha",
        "threshold": 243,
        "softness": 24,
        "usage": "透明疊框，適合用在 modal 或大白色面板外層",
    },
    {
        "category": "overlays",
        "name": "join_collection_title_overlay",
        "label": "加入收藏標題條 overlay",
        "box": (1190, 528, 1514, 607),
        "mode": "light_to_alpha",
        "threshold": 242,
        "softness": 24,
        "usage": "透明標題條，適合固定寬度 modal header 裝飾",
    },
    {
        "category": "overlays",
        "name": "filter_apply_button_bg",
        "label": "套用篩選按鈕底圖",
        "box": (1108, 286, 1367, 358),
        "mode": "opaque",
        "usage": "可當固定寬度 CTA 背景參考，不建議拉伸過大",
    },
    {
        "category": "overlays",
        "name": "filter_reset_button_bg",
        "label": "重置按鈕底圖",
        "box": (951, 286, 1068, 357),
        "mode": "opaque",
        "usage": "可當次要按鈕底圖參考，不建議直接覆蓋文字",
    },
    {
        "category": "decor",
        "name": "crown_main",
        "label": "皇冠",
        "box": (1236, 906, 1304, 961),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可直接放 header、title 或 card corner",
    },
    {
        "category": "decor",
        "name": "wing_left",
        "label": "左翅膀",
        "box": (1312, 905, 1372, 961),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可搭配皇冠做標題裝飾",
    },
    {
        "category": "decor",
        "name": "side_gem_purple",
        "label": "紫色側飾",
        "box": (1380, 905, 1440, 961),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可用於 panel 邊角裝飾",
    },
    {
        "category": "decor",
        "name": "ribbon_main",
        "label": "緞帶",
        "box": (1231, 957, 1418, 1008),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "適合 section title 或 badge 下方裝飾",
    },
    {
        "category": "decor",
        "name": "frame_circle",
        "label": "圓形花框",
        "box": (1422, 885, 1512, 1008),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "適合頭像、icon 外框或統計圓框裝飾",
    },
    {
        "category": "decor",
        "name": "gem_heart_main",
        "label": "主愛心水晶",
        "box": (26, 885, 96, 973),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合統計區或收藏圖示",
    },
    {
        "category": "decor",
        "name": "star_gold_large",
        "label": "大型金星",
        "box": (286, 882, 344, 943),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合 hero、卡框角落",
    },
    {
        "category": "decor",
        "name": "star_pink_sparkle",
        "label": "粉色星光",
        "box": (344, 885, 403, 934),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合按鈕上方或背景散佈",
    },
    {
        "category": "decor",
        "name": "star_sparkle_cluster",
        "label": "星點群",
        "box": (397, 946, 463, 1002),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合背景點綴",
    },
    {
        "category": "decor",
        "name": "heart_outline_large",
        "label": "大愛心框",
        "box": (675, 882, 731, 950),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合收藏 icon 附近或統計區裝飾",
    },
    {
        "category": "decor",
        "name": "bow_main",
        "label": "蝴蝶結",
        "box": (683, 934, 756, 1007),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合 modal 標題或卡片底部點綴",
    },
    {
        "category": "decor",
        "name": "triangle_main",
        "label": "主三角裝飾",
        "box": (803, 929, 880, 1002),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合背景幾何裝飾",
    },
    {
        "category": "decor",
        "name": "geometry_cluster",
        "label": "幾何碎片群",
        "box": (781, 886, 965, 1003),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合大背景角落裝飾",
    },
    {
        "category": "decor",
        "name": "glow_purple_ring",
        "label": "紫色光環",
        "box": (1063, 885, 1149, 971),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合統計圖或按鈕光效",
    },
    {
        "category": "decor",
        "name": "glow_white_orb",
        "label": "白色光球",
        "box": (1148, 886, 1210, 968),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 18,
        "usage": "適合背景柔光點綴",
    },
    {
        "category": "icons",
        "name": "header_icon_menu",
        "label": "選單 icon",
        "box": (88, 590, 151, 655),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可改成背景圖或 img icon",
    },
    {
        "category": "icons",
        "name": "header_icon_search",
        "label": "搜尋 icon",
        "box": (158, 590, 222, 655),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可放搜尋按鈕",
    },
    {
        "category": "icons",
        "name": "header_icon_heart_fill",
        "label": "實心收藏 icon",
        "box": (299, 590, 362, 655),
        "mode": "light_to_alpha",
        "threshold": 246,
        "softness": 16,
        "usage": "可放收藏按鈕",
    },
]


def trim_transparent(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def light_to_alpha(image: Image.Image, threshold: int, softness: int) -> Image.Image:
    rgba = image.convert("RGBA")
    result = []
    for red, green, blue, alpha in list(rgba.getdata()):
        brightness = min(red, green, blue)
        if brightness >= threshold:
            result.append((red, green, blue, 0))
        elif brightness >= threshold - softness:
            ratio = (threshold - brightness) / max(1, softness)
            result.append((red, green, blue, int(alpha * ratio)))
        else:
            result.append((red, green, blue, alpha))
    rgba.putdata(result)
    return trim_transparent(rgba)


def save_asset(source: Image.Image, spec: dict) -> dict:
    crop = source.crop(spec["box"])
    if spec["mode"] == "light_to_alpha":
      crop = light_to_alpha(crop, spec["threshold"], spec["softness"])

    target_dir = OUT / spec["category"]
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{spec['name']}.png"
    crop.save(target)

    return {
        "category": spec["category"],
        "name": spec["name"],
        "label": spec["label"],
        "file": str(target),
        "usage": spec["usage"],
        "size": {"width": crop.size[0], "height": crop.size[1]},
        "mode": spec["mode"],
    }


def write_usage_guide(manifest: list[dict]) -> None:
    css = """/* Apply-ready asset usage examples */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("./backgrounds/header_bg_strip.png") center/cover no-repeat;
  opacity: .92;
}

.hero__crown {
  position: absolute;
  top: 14px;
  left: 18px;
  width: 42px;
  height: 34px;
  background: url("./decor/crown_main.png") center/contain no-repeat;
}

.detail-frame-overlay {
  position: absolute;
  inset: 0;
  background: url("./overlays/card_detail_frame_overlay.png") center/contain no-repeat;
  pointer-events: none;
}

.modal-frame-overlay {
  position: absolute;
  inset: 0;
  background: url("./overlays/modal_frame_overlay.png") center/100% 100% no-repeat;
  pointer-events: none;
}
"""
    (OUT / "usage-snippets.css").write_text(css, encoding="utf-8")

    lines = [
        "# UI 套用安全版素材",
        "",
        "這一包只保留適合直接掛版的素材，避免整塊截圖硬套造成怪異感。",
        "",
        "## 建議用法",
        "",
        "- `backgrounds/`：只用在局部區塊背景，不要整頁平鋪。",
        "- `overlays/`：拿來疊在既有 CSS 結構上，不要單獨當元件本體。",
        "- `decor/`：最安全，可直接作為絕對定位裝飾。",
        "- `icons/`：可直接取代 emoji 或字元 icon。",
        "",
        "## 素材清單",
        "",
    ]

    for item in manifest:
        rel = Path(item["file"]).relative_to(OUT).as_posix()
        lines.append(
            f"- `{rel}` | {item['label']} | {item['size']['width']}x{item['size']['height']} | {item['usage']}"
        )

    lines.extend(
        [
            "",
            "另附 `usage-snippets.css` 作為掛版參考。",
            "預覽請開 `preview.html`。",
        ]
    )
    (OUT / "README.md").write_text("\n".join(lines), encoding="utf-8")


def write_preview(manifest: list[dict]) -> None:
    cards = []
    for item in manifest:
        rel = Path(item["file"]).relative_to(OUT).as_posix()
        cards.append(
            "<article class='card'>"
            f"<div class='thumb'><img src='{rel}' alt='{item['label']}' /></div>"
            f"<div class='meta'><strong>{item['name']}</strong><br>{item['label']}<br>{item['usage']}<br><span>{rel}</span></div>"
            "</article>"
        )
    html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Apply Ready UI Assets</title>
<style>
body{{margin:0;padding:24px;background:#faf6ff;font-family:'Segoe UI','Noto Sans TC',sans-serif;color:#4e3e68;}}
h1{{margin:0 0 8px;}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:20px;}}
.card{{background:#fff;border:1px solid #ebdefd;border-radius:18px;padding:12px;box-shadow:0 10px 24px rgba(130,100,182,.08);}}
.thumb{{display:grid;place-items:center;min-height:150px;border-radius:14px;background:
linear-gradient(180deg,#fff,#fcf7ff),
radial-gradient(circle at top left,rgba(255,208,234,.4),transparent 35%),
radial-gradient(circle at bottom right,rgba(189,206,255,.35),transparent 32%);
}}
.thumb img{{max-width:100%;max-height:150px;}}
.meta{{margin-top:10px;font-size:12px;line-height:1.5;word-break:break-word;}}
.meta span{{color:#8a7ba5;}}
</style>
</head>
<body>
<h1>UI 套用安全版素材</h1>
<p>這一包是為了直接掛進 PWA 而整理過的版本。</p>
<div class="grid">
{''.join(cards)}
</div>
</body>
</html>"""
    (OUT / "preview.html").write_text(html, encoding="utf-8")


def main() -> None:
    source_path = Path(os.environ[SOURCE_ENV])
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(source_path)
    manifest = [save_asset(source, spec) for spec in ASSETS]
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    write_usage_guide(manifest)
    write_preview(manifest)
    print(OUT)
    print(len(manifest))


if __name__ == "__main__":
    main()
