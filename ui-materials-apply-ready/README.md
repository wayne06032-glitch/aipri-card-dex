# UI 套用安全版素材

這一包只保留適合直接掛版的素材，避免整塊截圖硬套造成怪異感。

## 建議用法

- `backgrounds/`：只用在局部區塊背景，不要整頁平鋪。
- `overlays/`：拿來疊在既有 CSS 結構上，不要單獨當元件本體。
- `decor/`：最安全，可直接作為絕對定位裝飾。
- `icons/`：可直接取代 emoji 或字元 icon。

## 素材清單

- `backgrounds/header_bg_strip.png` | Header 背景條 | 393x49 | header 背景橫條，可作為 banner 背景圖
- `backgrounds/bg_sparkle_strip.png` | 星光背景條 | 396x104 | 頁面局部星光背景，可放 hero 下層或 section 背景
- `overlays/card_detail_frame_overlay.png` | 卡片詳細框 overlay | 240x232 | 透明疊框，適合 absolute overlay 在卡片詳細圖外層
- `overlays/modal_frame_overlay.png` | 彈窗大框 overlay | 220x258 | 透明疊框，適合用在 modal 或大白色面板外層
- `overlays/join_collection_title_overlay.png` | 加入收藏標題條 overlay | 315x62 | 透明標題條，適合固定寬度 modal header 裝飾
- `overlays/filter_apply_button_bg.png` | 套用篩選按鈕底圖 | 259x72 | 可當固定寬度 CTA 背景參考，不建議拉伸過大
- `overlays/filter_reset_button_bg.png` | 重置按鈕底圖 | 117x71 | 可當次要按鈕底圖參考，不建議直接覆蓋文字
- `decor/crown_main.png` | 皇冠 | 68x55 | 可直接放 header、title 或 card corner
- `decor/wing_left.png` | 左翅膀 | 60x56 | 可搭配皇冠做標題裝飾
- `decor/side_gem_purple.png` | 紫色側飾 | 60x56 | 可用於 panel 邊角裝飾
- `decor/ribbon_main.png` | 緞帶 | 187x32 | 適合 section title 或 badge 下方裝飾
- `decor/frame_circle.png` | 圓形花框 | 73x90 | 適合頭像、icon 外框或統計圓框裝飾
- `decor/gem_heart_main.png` | 主愛心水晶 | 70x88 | 適合統計區或收藏圖示
- `decor/star_gold_large.png` | 大型金星 | 51x57 | 適合 hero、卡框角落
- `decor/star_pink_sparkle.png` | 粉色星光 | 57x49 | 適合按鈕上方或背景散佈
- `decor/star_sparkle_cluster.png` | 星點群 | 59x27 | 適合背景點綴
- `decor/heart_outline_large.png` | 大愛心框 | 42x51 | 適合收藏 icon 附近或統計區裝飾
- `decor/bow_main.png` | 蝴蝶結 | 56x33 | 適合 modal 標題或卡片底部點綴
- `decor/triangle_main.png` | 主三角裝飾 | 77x53 | 適合背景幾何裝飾
- `decor/geometry_cluster.png` | 幾何碎片群 | 164x97 | 適合大背景角落裝飾
- `decor/glow_purple_ring.png` | 紫色光環 | 86x86 | 適合統計圖或按鈕光效
- `decor/glow_white_orb.png` | 白色光球 | 59x82 | 適合背景柔光點綴
- `icons/header_icon_menu.png` | 選單 icon | 46x51 | 可改成背景圖或 img icon
- `icons/header_icon_search.png` | 搜尋 icon | 64x51 | 可放搜尋按鈕
- `icons/header_icon_heart_fill.png` | 實心收藏 icon | 63x51 | 可放收藏按鈕

另附 `usage-snippets.css` 作為掛版參考。
預覽請開 `preview.html`。