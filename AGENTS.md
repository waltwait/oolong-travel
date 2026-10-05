# 烏龍出遊記工作規則

- 使用繁體中文。修改前先檢查本機變更，安全時以 `git pull --ff-only` 同步。
- 這是獨立公開 repo `waltwait/oolong-travel`；現有 Travel 是不同旅行，不匯入、共用或修改其行程、資料、styles、assets 或 skills。
- GitHub Pages 由本站 `.github/workflows/pages.yml` 發布 `main` 的 `docs/`。所有本站檔案與圖示都在本 repo；站內 URL 用相對路徑，適用 `/oolong-travel/`。
- 總覽資料在 `docs/trips.js`，每趟網站在 `docs/{地點}-{YYYY-MM}/`；同月第二趟可加日或明確識別碼，既有網址不要任意改名。
- 保留歷史旅行、手動筆記、評分、花費、付款人與結清狀態；不把已結束的旅行改成新的計畫。
- 嘉義分帳在 `docs/chiayi-2026-10/settle.js`，測試在 `tests/settle.test.js`。金額與計算有變更時，執行測試並核對旅行實際帳目。
- 本站只有一個 manifest 和一個 root service worker。改快取內容或邏輯時更新 `docs/sw.js` 的版本，只刪 `oolong-travel-` 前綴的舊版。
- 新旅行需要加入 `docs/trips.js` 和離線核心資源；不依賴其他 repo 的網址或檔案。
- 網站是公開內容；新增旅行的動態資料依當前來源查證，提供來源與查詢日期。不要把私人規劃資料自行加入網站。
- 修改後檢查 JS 語法、子路徑、手機、日期狀態與離線行為。只有使用者要求建立、commit、push 或發布時，才執行對應 GitHub 操作。
