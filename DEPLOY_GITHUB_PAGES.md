# GitHub Pages 部署說明

## 直接更新既有 repository

1. 打開你的 GitHub repository。
2. 將這個資料夾內的所有檔案與資料夾，上傳到 repo root。
3. 確認首頁入口是 `index.html`。
4. 若 repo 先前已有舊檔，請用這份版本覆蓋。

## GitHub Pages 設定

1. 到 repository 的 `Settings`。
2. 打開 `Pages`。
3. `Source` 選 `Deploy from a branch`。
4. Branch 選 `main`。
5. Folder 選 `/ (root)`。
6. 儲存後等待 GitHub 部署完成。

## 注意事項

- 這份版本是純前端 GitHub Pages 版，不需要 `android/`、`node_modules/`、`package.json`。
- 若你之後只改 UI 或資料，重新上傳同名檔案覆蓋即可。
- `localStorage` 是存在使用者自己的瀏覽器，不會跟 GitHub 同步。

## 建議一起更新的核心檔案

- `index.html`
- `style.css`
- `app.js`
- `cards.json`
- `cards-data.js`
- `manifest.json`
- `service-worker.js`
- `icons/`
- `images/`
