# 秘密偶像公主圖鑑 Android APK 專案

這個專案是以純 `HTML / CSS / JavaScript` 製作的圖鑑前端，並已整理成可用 `Capacitor` 打包成 Android APK 的結構。第一版目標是可離線執行，不需要後端、登入或雲端同步。

## 專案重點

- 保留現有圖鑑功能
- 保留 `localStorage`，用來保存 `owned / wanted / favorite / note`
- `cards.json`、`cards-data.js`、`images/`、`icons/` 等靜態資源可隨 APK 一起打包
- `www/` 為 Capacitor 實際使用的網頁輸出目錄

## 目錄結構

```text
aipri-card-dex/
├─ app.js
├─ cards-data.js
├─ cards.json
├─ capacitor.config.json
├─ index.html
├─ manifest.json
├─ package.json
├─ README.md
├─ service-worker.js
├─ style.css
├─ scripts/
│  └─ build-www.mjs
├─ icons/
├─ images/
└─ www/              ← build 後自動產生
```

## 1. 安裝 Node.js

先安裝 Node.js LTS 版本。

官方網站：

[https://nodejs.org/](https://nodejs.org/)

安裝完成後，重新開啟終端機，確認：

```bash
node -v
npm -v
```

## 2. 安裝專案依賴

在專案根目錄執行：

```bash
npm install
```

這會安裝：

- `@capacitor/core`
- `@capacitor/cli`
- `@capacitor/android`

## 3. 建立 www/ 輸出資源

這個專案把原始網頁檔保留在根目錄，並透過 build 腳本複製到 `www/`。

執行：

```bash
npm run build
```

或：

```bash
npm run copy:web
```

執行後會：

- 清空舊的 `www/`
- 把 `index.html`、`style.css`、`app.js`
- 把 `cards.json`、`cards-data.js`
- 把 `manifest.json`、`service-worker.js`
- 把 `icons/`、`images/`

全部複製到 `www/`

## 4. 建立 Android 專案

第一次初始化 Android 平台時執行：

```bash
npx cap add android
```

執行後會建立：

```text
android/
```

## 5. 同步網頁資源到 Android

每次你更新圖鑑前端、`cards.json` 或圖片後，請執行：

```bash
npx cap sync android
```

建議平常用這個完整流程：

```bash
npm run build
npx cap sync android
```

也可以直接用 package script：

```bash
npm run cap:sync:android
```

## 6. 用 Android Studio 開啟專案

執行：

```bash
npx cap open android
```

或：

```bash
npm run cap:open:android
```

這會用 Android Studio 開啟 `android/` 專案。

## 7. 在 Android Studio 產生 APK

進入 Android Studio 後：

1. 等 Gradle 同步完成
2. 上方選單點 `Build`
3. 選 `Build Bundle(s) / APK(s)`
4. 再選 `Build APK(s)`
5. 等待編譯完成
6. 點通知中的 `locate` 找到 APK

常見輸出位置類似：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

如果要正式版本，可改用簽署流程：

1. `Build`
2. `Generate Signed Bundle / APK`
3. 選 `APK`
4. 選擇 keystore
5. 完成 release APK 產生

## 8. 離線資源與儲存說明

### 離線資源

以下資源都會跟著 APK 進入 App：

- `cards.json`
- `cards-data.js`
- `images/front`
- `images/back`
- `icons`

因此第一版可以在 Android 裝置上離線瀏覽。

### 本機儲存

使用者狀態仍使用 `localStorage`：

- `owned`
- `wanted`
- `favorite`
- `note`

key 格式仍為：

```text
aipri_card_state_卡片ID
```

例如：

```text
aipri_card_state_AP1-001
```

## 9. 建議的完整打包流程

每次更新後，依序執行：

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

如果 `android/` 已經建立過，之後通常只需要：

```bash
npm run build
npx cap sync android
npx cap open android
```

## 10. 注意事項

- 這個專案不需要後端
- 不需要登入
- 不需要雲端同步
- 第一版以 Android APK 離線執行為主
- 若你更新卡片資料或圖片，記得重新執行 `npm run build` 與 `npx cap sync android`
