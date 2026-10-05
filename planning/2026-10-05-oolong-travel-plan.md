# 烏龍出遊記實作計畫

使用者於 2026-10-05 確認：建立公開 `waltwait/oolong-travel`，現有 Travel 為不同旅行，不共用。依既有研究提案在本次對話直接實作並發布。

**目標：** 一個獨立 repo、一個烏龍出遊記總覽，以及完整的嘉義子頁。

**架構：** 本站 GitHub Actions 發布 `main` 的 `docs/`；初始 branch 發布在 deploy job 等待 runner，改用本站的單一發布 job。靜態首頁讀取本站 `trips.js`，嘉義內容保留原 HTML，使用本站 manifest、service worker 與 App 腳本。沒有外部 Travel 資源、匯入、符號連結或共享資料。

**技術：** HTML、CSS、JavaScript；原有分帳函式；Node 內建測試；Playwright 驗證手機與離線；無產品套件相依。

**規格：** `research/2026-10-05-oolong-travel.md` 加上本檔第一段的使用者確認。

## 限制

- 網站名稱「烏龍出遊記」，公開 repo 名稱 `oolong-travel`。
- 只有嘉義 2026-10-03 至 2026-10-04，13 筆 NT$3,939、4 人、已結清、9 件烏龍、7 筆評分必須保持。
- 新站檔案全部由本 repo 管理；禁止共用現有 Travel 的檔案、行程與 assets。
- 保留來源 Git 歷史，原雞肉飯 repo 與網址維持現狀。
- 所有站內 URL 適用 `/oolong-travel/` 子路徑；快取只刪本站前綴。

## 設計

延續雞肉飯的照片、米白與暖橘，做成朋友出遊的回憶冊。以「烏龍出遊記」標題與小丑印章形成辨識，第一屏就能開啟嘉義旅行；已結束的旅行歸在回憶，沒有下一趟時明確顯示未決定。字體以本機繁中宋體呈現手帳標題，內文用系統黑體，不載入 Travel 樣式或外部字型。

色票：紙張 `#faf7f2`、墨色 `#26221d`、暖橘 `#c8551f`、墨綠 `#1f6b52`、莓紅 `#a3123a`、分隔線 `#e7e0d6`。內容左對齊，頁首只做短標題，照片旅行卡作為主要入口。

## 驗證重點

1. 今天、出發前、旅途中、旅行結束後的狀態；首頁不把嘉義顯示為未來旅行。
2. `/oolong-travel/` 子路徑下的圖片、腳本、manifest、返回總覽與分享圖片。
3. 手機分頁、原有記帳／分帳、9 件烏龍與評分保留。
4. 所有核心頁已快取後，離線打開各頁仍是正確內容。
5. 升級本站 service worker 只清理本站舊快取，保留不同名稱的快取。

## 工作項目

### 1. 獨立首頁與旅行登錄

- [x] 建立 `docs/index.html`、`docs/assets/journal.css`、`docs/trips.js`、`docs/assets/home.js`。
- [x] 旅行登錄介面為 `window.OOLONG_TRIPS = [{slug,title,destination,start,end,cover,summary}]`；日期皆為 ISO 日期，路徑使用相對 URL。
- [x] 首頁渲染介面為 `window.OolongHome`，提供 `stateAt(trip,date)`、`render(trips,date)`；正常使用當下台北日期，允許有效 `?today=YYYY-MM-DD` 模擬。
- [x] 卡片有原封面、日期、旅程摘要與真正的嘉義子頁連結；沒有虛構旅行。

### 2. 嘉義搬移與獨立 PWA

- [x] 保留嘉義正文、照片與分帳函式；修改連回總覽、manifest、圖示、分享圖片和本站 App 腳本。
- [x] 建立本站 `docs/manifest.webmanifest`、`docs/sw.js`、`docs/assets/app.js` 與本站圖示；移除新站嘉義自己的 manifest 與 service worker。
- [x] 用單一 `oolong-travel-v1` 快取，核心列出首頁、旅行登錄、腳本、圖示、嘉義 HTML／分帳／照片；離線按 URL 回退。
- [x] PWA `id`、`scope`、`start_url` 都以總覽為基準。快取更新時只清理 `oolong-travel-` 開頭的其他版本；請求只處理本站 scope。
- [x] 修正原測試 require 路徑為 `../docs/chiayi-2026-10/settle.js`。

### 3. 文件與驗收

- [x] 新增 `README.md`、`AGENTS.md`、`docs/.nojekyll`、`.gitignore`，記錄如何新增旅行、預覽、驗證、發布以及資料來源。
- [x] 執行原分帳測試、JS 語法檢查及 Playwright 驗證首頁日期、手機分頁、帳目、烏龍、圖片和離線。另驗證新站不含任何 `/travel/` URL／檔案依賴。
- [x] 對照來源嘉義頁面，驗證只有搬移必要的 header、導航與 PWA 改動。

### 4. 建立、發布與本機交付

- [x] 完成可檢查成果後，建立公開 `waltwait/oolong-travel`，以 `main` 推送保留的來源歷史與新變更。
- [ ] 設定 Pages 為 GitHub Actions，由本站 workflow 發布 `main` 的 `docs/`；檢查 Pages build 成功，再查公開首頁與嘉義頁、圖片、manifest。
- [x] 把完整獨立 checkout 放到 `/Users/sb/Code/Project/oolong-travel`，提供網站、repo 與本機來源連結。

自查：所有使用者需求都有對應工作項目，沒有需要共用 Travel 的資源，沒有待填的程式介面。使用本對話原生執行，未委派其他 agents。
