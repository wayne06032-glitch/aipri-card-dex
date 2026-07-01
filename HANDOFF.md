# 秘密偶像公主圖鑑 PWA 交接文件

更新日期：2026-05-02

## 專案定位

這是一個純前端的「秘密偶像公主圖鑑」PWA 專案，現階段以：

- 手機優先瀏覽
- 卡片圖鑑查詢
- JP / TW 持有數量管理
- 收藏與備註
- GitHub Pages 部署
- 不依賴後端

為主。

技術維持為：

- HTML
- CSS
- JavaScript

## 目前已完成功能

### 圖鑑功能

- 卡片列表顯示
- 卡片詳細頁
- 正反面切換
- 搜尋卡名 / 角色
- 角色 / 代數 / 分類 / 星數 / 持有狀態篩選
- 收藏分頁切換

### 收藏與本機保存

- 使用 `localStorage`
- key 格式：`aipri_card_state_卡號`
- 每張卡儲存欄位：
  - `jpCount`
  - `twCount`
  - `favorite`
  - `note`

### 舊資料相容

舊版若仍使用：

```json
{
  "owned": true,
  "wanted": false,
  "favorite": true,
  "note": "..."
}
```

目前會轉成：

```json
{
  "jpCount": 1,
  "twCount": 0,
  "favorite": true,
  "note": "..."
}
```

### 匯出 / 匯入

- 可匯出收藏資料為 JSON
- 可匯入先前匯出的 JSON

### PWA

- 已有 `manifest.json`
- 已有 `service-worker.js`
- 可安裝為 PWA
- 有離線快取機制

## 本輪 UI 狀態

這一輪已經做過 UI 重構，但後續又依需求收斂：

- 保留較乾淨的紫粉白系介面
- 卡圖下方不再顯示持有狀態 badge
- 新增素材最後只保留 `header_bg_strip.png` 作為 Header 底圖
- 其餘裝飾素材已先撤掉，避免比例問題

目前重點是：

- Header 有底圖
- 首頁、篩選區、統計區、詳細頁都可用
- 結構可持續微調

## App Icon 狀態

PWA icon 已經替換成新的圖片版本：

- `icons/icon-192.png`
- `icons/icon-512.png`

另外有做 icon 快取刷新處理：

- `index.html` 內 icon / manifest 路徑加上版本 query
- `manifest.json` 內 icon 路徑加上版本 query
- `service-worker.js` 快取版本升級
- `app.js` app shell 快取版本同步升級

這是為了讓 GitHub Pages / 手機安裝後更容易刷新到新 icon。

## 目前重要檔案

- `index.html`
  - 主畫面與詳細頁結構

- `style.css`
  - 目前 UI 主樣式

- `app.js`
  - 狀態管理
  - 搜尋 / 篩選
  - 詳細頁互動
  - localStorage
  - 匯出 / 匯入
  - PWA 快取預熱

- `cards.json`
  - 圖鑑資料

- `cards-data.js`
  - 內嵌備援卡片資料

- `manifest.json`
  - PWA 設定

- `service-worker.js`
  - 離線快取

- `icons/`
  - App icon

- `images/`
  - 卡圖素材

- `ui-materials-apply-ready/backgrounds/header_bg_strip.png`
  - 目前唯一仍在 UI 中保留使用的新增底圖素材

## 目前產出的封裝版本

### 完整工程包

- `aipri-card-dex-full-current-2026-05-01.zip`
  - 工作區完整狀態備份

### GitHub 上傳版

- `aipri-card-dex-github-ready-2026-05-01.zip`
  - 已整理成適合更新到 GitHub Pages 的版本

### 本次最新交接包

- 本次會另外輸出一份新的完整交接包

## GitHub 更新注意事項

如果要更新 GitHub Pages：

1. 不要把 zip 直接上傳到 repo
2. 要把 zip 解壓後的檔案內容覆蓋到 repo root
3. 再由 GitHub Desktop 或 git 做 commit / push

若網站更新後沒變化，通常是：

- GitHub Pages 尚未完成部署
- 瀏覽器快取
- service worker 快取
- 已安裝的 PWA icon 尚未刷新

## 建議後續優先項目

1. 把 `index.html` 內目前仍有亂碼的文案清乾淨
2. 微調 Header、卡片、詳細頁比例
3. 若要再導入素材，建議只用可控底圖或真正拆好的元件，不要再直接套整塊示意素材
4. 若要正式上線，建議再做一次實機 PWA 驗收

## 本機開發

建議用靜態伺服器啟動：

```bash
npx serve .
```

## 交接說明

這份交接包是「目前進度完整快照」。

內容包含：

- 主專案檔案
- 先前產出的素材整理資料夾
- GitHub 上傳版資料夾
- 腳本與相關輔助檔

若下一位接手者只要維護 GitHub Pages 版本，可直接以 GitHub 上傳版為主；
若需要完整追蹤目前工作痕跡與素材處理過程，請使用完整交接包。
