# GitHub Pages 上傳方式

這份專案已可直接部署到 GitHub Pages。

## 最簡流程

1. 建立一個新的 GitHub repository
2. 把這個資料夾內的所有檔案直接上傳到 repository 根目錄
3. 到 GitHub 的 `Settings` -> `Pages`
4. `Source` 選擇 `Deploy from a branch`
5. Branch 選 `main`，資料夾選 `/ (root)`
6. 存檔後等待 1 到 3 分鐘
7. 用 GitHub 提供的 `https://...github.io/...` 網址在手機開啟

## 手機使用

1. 用手機瀏覽器開啟 Pages 網址
2. 等畫面完整載入一次
3. 使用瀏覽器的「加入主畫面」
4. 之後就能像 App 一樣從主畫面開啟

## 注意

- 第一次上線後，請先在線上開啟一次，讓 Service Worker 快取完成
- 若你更新了 `cards.json` 或圖片，重新上傳覆蓋即可
- 如果 GitHub Pages 還沒更新，可以稍等幾分鐘後重新整理
