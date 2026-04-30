# 秘密偶像公主圖鑑 PWA

這是一個以手機直式操作為主的純前端 PWA 小程式，使用 `HTML / CSS / JavaScript` 製作，不需要後端或帳號登入。卡片清單由本機 `cards.json` 與 `images/front`、`images/back` 提供，使用者的收藏狀態與備註則儲存在瀏覽器的 `localStorage`。

## 專案結構

```text
aipri-card-dex/
├─ index.html
├─ style.css
├─ app.js
├─ cards.json
├─ manifest.json
├─ service-worker.js
├─ icons/
│  ├─ icon-192.png
│  └─ icon-512.png
├─ images/
│  ├─ front/
│  └─ back/
└─ README.md
```

## 如何放入圖片

1. 正面圖請放到 `images/front/`
2. 反面圖請放到 `images/back/`
3. `cards.json` 內的路徑請對應到實際檔名，例如：

```json
[
  {
    "id": "001",
    "name": "卡片名",
    "character": "角色名",
    "generation": "第1彈",
    "category": "一般卡",
    "frontImage": "images/front/001.jpg",
    "backImage": "images/back/001.jpg"
  }
]
```

目前這份專案已經依照你提供的原始資料自動整理出 `cards.json`，也會把卡圖整理到 `images/front` 與 `images/back`。

## 如何修改 cards.json

每張卡片建議保留以下欄位：

- `id`：卡片唯一編號，會同時作為 localStorage key 的尾碼
- `name`：卡片名稱
- `character`：角色名
- `generation`：代數或彈別，例如 `第1彈`
- `category`：分類，例如 `一般卡`、`特典卡`、`グミ`、`メモリアル`
- `frontImage`：正面圖路徑
- `backImage`：反面圖路徑

如果更新資料後有新增圖片，請一起放入對應資料夾。

## 如何在手機開啟

PWA 與 `fetch("cards.json")`、Service Worker 都需要透過 `http://` 或 `https://` 來開啟，不建議直接點 `file://`。

### 本機測試

可以在專案資料夾內啟動任一個靜態伺服器，例如：

```bash
npx serve .
```

或使用其他你習慣的靜態伺服器工具。接著讓手機與電腦連到同一個網路，使用電腦的區域網路 IP 開啟網站。

### 加入主畫面

1. 用手機瀏覽器開啟網站
2. 等待頁面載入完成
3. 使用瀏覽器的「加入主畫面」或頁面上的「加入主畫面」按鈕

## 匯出 / 匯入備份

### 匯出

點首頁上的 `匯出備份`，就會下載一份 JSON，內含每張卡片的：

- `owned`
- `wanted`
- `favorite`
- `note`

### 匯入

點 `匯入備份`，選擇先前匯出的 JSON 檔即可恢復紀錄。

localStorage 的 key 格式為：

```text
aipri_card_state_卡片ID
```

例如：

```text
aipri_card_state_001
```

## 功能摘要

- 首頁卡片網格顯示
- 卡片詳細彈窗
- 正反面切換
- 已擁有 / 想要 / 收藏
- 單張卡片備註自動儲存
- 代數、角色、收藏、已擁有、想要等篩選
- 卡片名 / 角色名搜尋
- 收藏夾模式
- 匯出 / 匯入備份
- PWA 與離線快取

## 部署到 GitHub Pages

1. 建立 GitHub repository
2. 把 `aipri-card-dex` 內的檔案推上去
3. 到 GitHub repository 的 `Settings` > `Pages`
4. Source 選擇部署分支，例如 `main`
5. 資料夾選擇 `/ (root)` 或你放置專案的子目錄
6. 儲存後等待 GitHub Pages 提供網址

如果專案不是部署在網域根目錄，而是在子路徑中，請同步調整：

- `manifest.json` 的 `start_url`
- `service-worker.js` 的快取路徑

## 備註

若你之後想把 `localStorage` 改成 `IndexedDB`，這個專案也很適合再往上擴充。
