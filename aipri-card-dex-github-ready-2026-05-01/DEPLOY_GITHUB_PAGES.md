# GitHub Pages 部署說明

## 直接更新既有 repository

1. 打開你的 GitHub repository 本地資料夾。
2. 將這個資料夾內的所有檔案與資料夾，覆蓋到 repo root。
3. 確認首頁入口是 `index.html`。
4. 回 GitHub Desktop 檢查變更、commit、push。

## GitHub Pages 設定

1. 到 repository 的 `Settings`
2. 打開 `Pages`
3. `Source` 選 `Deploy from a branch`
4. Branch 選 `main`
5. Folder 選 `/ (root)`

## 注意事項

- 這份版本是純前端 GitHub Pages 版，不需要 `android/`、`node_modules/`、`package.json`
- `localStorage` 是存在使用者自己的瀏覽器，不會跟 GitHub 同步
- 若頁面更新後沒變化，請強制重新整理或清快取
