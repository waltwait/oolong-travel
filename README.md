# 烏龍出遊記

每一趟旅行，和路上的烏龍。用一個獨立 repo 收錄行程、美食評分、分帳與旅行回憶。

首頁：[烏龍出遊記](https://waltwait.github.io/oolong-travel/)

| 出遊 | 日期 | 頁面 |
| --- | --- | --- |
| 嘉義火雞肉飯 | 2026/10/03–10/04 | [嘉義出遊記](https://waltwait.github.io/oolong-travel/chiayi-2026-10/) |

這個 repo 和既有 Travel 各自管理不同旅行，沒有共用檔案、資料或部署。嘉義內容承接自 [chiayi-turkey-rice](https://github.com/waltwait/chiayi-turkey-rice)，保留其 Git 歷史；原 repo 與舊網站仍保留。

## 結構

- `docs/index.html`：總覽首頁。
- `docs/trips.js`：本站旅行清單、日期與封面。
- `docs/assets/journal.css`、`docs/assets/home.js`：本站首頁樣式與狀態。
- `docs/{slug}/`：每趟旅行的完整頁面。
- `docs/manifest.webmanifest`、`docs/sw.js`、`docs/assets/app.js`、`docs/assets/icons/`：本站獨立 PWA 與離線資源。
- `research/`、`planning/`：研究提案與實作紀錄，未作為 Pages 內容發布。

## 新增一趟

1. 新增 `docs/{地點}-{YYYY-MM}/`，放入該趟 `index.html`、照片及腳本。
2. 在子頁引用 `../manifest.webmanifest`、`../assets/icons/` 的圖示與 `../assets/app.js`。不要新增子頁 service worker。
3. 在 `docs/trips.js` 加入一筆，欄位見嘉義範例。`start`、`end` 用實際 ISO 旅行日期；`slug` 是子資料夾名；`cover` 從 `docs/` 起算。
4. 把該趟離線必需檔案加入 `docs/sw.js` 的 `CORE`，更新快取版本。
5. 預覽、核對日期與手機操作，得到發布指示後再 commit／push。

首頁按台北日期區分下一趟、旅途中與旅行回憶；網址加 `?today=2026-10-03` 可預覽特定日期的狀態。

## 本機預覽與檢查

不需要安裝產品套件。

```sh
python3 -m http.server 8000 --directory docs
node tests/settle.test.js
node --check docs/assets/home.js
node --check docs/assets/app.js
node --check docs/sw.js
node --check docs/trips.js
```

開啟 http://localhost:8000/。PWA 要透過 HTTP localhost 或 HTTPS 使用，不能以直接開啟檔案的方式驗證。

`tests/browser-check.cjs` 另驗證手機頁面、完整帳目、烏龍、日期、子路徑、離線與快取隔離；使用外部可用的 Playwright 執行環境，不列為網站套件依賴。指定 `PLAYWRIGHT_MODULE` 為該環境的 Playwright 模組路徑，並用 `SITE_URL` 指定測試網址。

## 手機與離線

Safari 可透過分享選單加入主畫面；Android 支援安裝時會顯示本站安裝按鈕。App 名稱是「烏龍出遊記」，入口是旅行總覽。看過或核心已快取的行程可離線查看；外部導航與資料來源需網路。

新站採獨立 `oolong-travel-` 快取名稱，只清除本站舊版。同帳號 GitHub Pages 在瀏覽器仍屬相同網域；其他舊網站若自行刪除該網域全部快取，可能影響本站離線內容。本次未修改其他 repo，重新連網可補存本站內容。

嘉義記帳與烏龍為檔案中已記錄的內容，沒有多人即時編輯後台。吃完勾選沿用原行為，重新整理會重置。

## 發布

GitHub Pages 設為 `Deploy from a branch`，來源 `main`、`/docs`。推送後等待 Pages build 成功，檢查首頁與各趟子頁再確認上線。

原有嘉義的 13 筆帳目合計 NT$3,939，4 人，已全部結清；9 件烏龍與評分榜均保留。來源頁面的計畫標題／描述也保留，未以搬移替代歷史內容修訂。
