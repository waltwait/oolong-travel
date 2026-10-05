# 烏龍出遊記：新 repo 與 GitHub Pages 研究提案

研究日期：2026-10-05（Asia/Taipei）。狀態：使用者於 2026-10-05 確認公開 `oolong-travel` 與獨立收錄範圍；本文保留初始研究提案，實作結果另見 planning 與 README。

## 目標與目前理解

以「烏龍出遊記」作為網站名稱，用一個 repo 管理多趟旅行，像既有 Travel 一樣有總覽首頁與各趟子頁面。嘉義火雞肉飯成為第一趟旅行，既有行程、實際花費、分帳、店家評分與烏龍紀錄全部保留。

本提案中的「新 Page」暫按 GitHub Pages 網站理解。收錄範圍已向使用者詢問：先收這類烏龍出遊並保留獨立 Travel，或一併整合新加坡與釜山。使用者已選擇第一種方式，並明確要求不要與 Travel 共用。新網站不引用 Travel 的檔案、資料或資源。

## 已完成的同步與盤點

| 項目 | 已確認結果 |
| --- | --- |
| 雞肉飯來源 | `waltwait/chiayi-turkey-rice`，公開 repo |
| 雞肉飯同步 | 已執行 `git pull --ff-only`，`main` 更新至 `334606370e629b35ae6ee50f0c883798986651be` |
| 雞肉飯發布來源 | GitHub API 顯示 `main` 的 `/`，Pages 狀態 `built` |
| 雞肉飯網址 | https://waltwait.github.io/chiayi-turkey-rice/ |
| 第一趟日期 | 2026-10-03 至 2026-10-04，嘉義兩日 |
| 旅行內容 | Day 1、Day 2、記帳、烏龍四個分頁，另有評分榜 |
| 帳目 | 13 筆，合計 NT$3,939，4 人平分；原資料已標為全部結清 |
| 烏龍紀錄 | 9 件；最新提交保留第 9 件文字，移除截圖 |
| 分帳檢查 | 原有 `node settle.test.js` 執行成功，輸出 `ALL TESTS PASS` |
| Travel 同步 | 已執行 `git pull --ff-only`，`main` 更新至 `ba72a4ca6f7d56d215c76feeee64157ba8a6fdce` |
| Travel 結構 | `docs/index.html` 總覽，`docs/{slug}/` 各趟網站，共用樣式與根層 PWA |
| Travel 首頁內容 | 下一趟／進行中看板與旅行印章牆；目前有新加坡與釜山 |

以上來自同步後的本機檔案與 GitHub API。瀏覽搜尋工具未能開啟已發布 Travel 首頁，尚未進行手機版視覺驗證。

## repo 命名

| 名稱 | 適用性 |
| --- | --- |
| **`oolong-travel`（建議）** | 簡短、容易輸入，與既有 Travel 概念一致；中文品牌仍用「烏龍出遊記」 |
| `oolong-trips` | 強調一趟一篇，比較像旅行集 |
| `oolong-adventures` | 更偏旅途故事，網址較長 |

2026-10-05 透過 GitHub API 查閱 `waltwait` 的公開 repo 清單，以上三個名稱均未出現。這是當下公開清單的檢查；建立前仍須再次確認目標名稱，不能視為保留名稱。

建議的 repo 為 `waltwait/oolong-travel`，維持目前公開靜態網站的模式。預計首頁網址為 `https://waltwait.github.io/oolong-travel/`，第一趟為 `https://waltwait.github.io/oolong-travel/chiayi-2026-10/`；兩者均是提案網址，尚未建立。

## 管理方式比較

| 方式 | 優點 | 代價與適用情況 |
| --- | --- | --- |
| **建立獨立新 repo，承接雞肉飯內容（建議）** | 品牌與網址清楚；舊站可先維持；之後每趟新增子資料夾 | 需設定新 Pages；舊 repo 的 issues、PR 等不會因複製 Git 歷史而移轉 |
| 雞肉飯 repo 直接改名 | 延續同一 repo 的 issues、PR、提交等資訊 | GitHub Pages 專案網址不隨 repo 改名自動轉址，舊分享連結要另處理 |
| 直接併入 Travel | 一個既有 repo 收所有旅行，維護成本最低 | 與目前要求新 repo、獨立「烏龍出遊記」品牌的方向不同 |

改名的網址限制已查證：[GitHub repo 改名說明](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository)。

## 建議的第一版網站

首頁頂部顯示「烏龍出遊記」與旅行數；有進行中或下一趟旅行時顯示出發看板，其餘旅行以照片、地點和日期排列。今天是 2026-10-05，嘉義已結束，應列在旅行回憶中，不能顯示為下一趟。

第一張旅行卡使用原有 `cover.jpg`，連到嘉義子頁。子頁保留目前完整內容與操作，只加入回總覽的入口，調整 PWA 及必要相對路徑。這樣可以先完成多趟管理，避免在搬移時同時重寫已使用的旅行內容。

風格延續現有米白底、暖橘色、照片與旅行手帳感，烏龍故事作為旅行特色。第一版不需要登入、資料庫或額外的管理後台；更新旅行仍由修改 repo 內容完成。

```text
oolong-travel/
├── README.md
├── AGENTS.md
├── research/                     # 研究及搬移紀錄，不是網站發布來源
└── docs/                        # GitHub Pages 發布來源
    ├── .nojekyll
    ├── index.html               # 烏龍出遊記總覽
    ├── trips.js                 # 旅行登錄：地點、日期、子頁路徑、封面
    ├── manifest.webmanifest     # 全站的 App 名稱、入口及範圍
    ├── sw.js                    # 全站離線快取
    ├── assets/                  # 首頁樣式、共用 App 程式、品牌圖示
    └── chiayi-2026-10/
        ├── index.html           # 原有嘉義旅行內容
        ├── settle.js            # 先保留原有分帳函式
        ├── cover.jpg
        └── ...                  # 子頁仍有使用的原圖示
```

首頁用小型旅行登錄清單，不直接複製 Travel 的 `window.TRIP` 載入流程：嘉義目前沒有 `itinerary.js`，盲目套用會讀不到日期。各趟完整內容先各自保留；之後需要共用資料格式時再擴充。

GitHub Pages 適合這類 HTML、CSS、JS 靜態網站；專案網站預設網址包含 repo 名稱。發布來源可以使用 `main` 的 `/docs`，與 Travel 的慣例一致。[Pages 說明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[發布來源設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 搬移時必須處理的相容性

1. **保持旅行事實。** 比對 13 筆花費、NT$3,939 合計、4 人與已結清標記；保留 9 件烏龍、評分榜、日期及導航。搬移不代表重新規劃已結束的旅行。
2. **保留可追溯的來源。** 新 repo 可承接雞肉飯的 Git 提交歷史，再做資料夾搬移；不需要同時承接所有遠端分支。舊 repo 的 GitHub issues／PR 等另屬平台資料。[GitHub 複製 repo 文件](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository)。
3. **修正子路徑。** 圖片、腳本、首頁入口與 manifest 以實際位置採相對路徑；公開圖片網址改到新站。新站下首頁與嘉義子頁都必須可直接開啟。
4. **統一新站 App 入口。** 新站 root manifest 指向總覽，新站 root service worker 管理所有子頁；移除嘉義子頁對自身 `sw.js` 的註冊，避免新站裡重疊的快取策略。舊站已安裝的 App 不會因新 manifest 自動轉為新 App，需要另說明新入口。
5. **快取名稱與刪除條件。** 現有雞肉飯和 Travel 的 activation 都會刪除「所有名稱不同於自己」的快取。它們都在 `waltwait.github.io`，程式分析顯示可能清掉彼此與新站的快取。新站應只刪除 `oolong-travel-` 前綴的舊版；既有網站若繼續使用，也需要另行修正自身的刪除範圍，單改新站不足以完全排除互相清除。[CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)、[delete()](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/delete)。
6. **避免所有離線頁都變成嘉義。** 原雞肉飯 service worker 會把 navigation 回應寫入同一份 `index.html`，適合目前單頁。多趟網站要按各頁 URL 存取與回退，不能原封不動沿用。
7. **首頁資訊更新來源。** 旅行日期與路徑由登錄清單提供；不假造下一趟，不複製容易過期的記帳摘要。網站上的記帳是 repo 內的固定內容，並非多人即時同步編輯。
8. **歷史進度實際狀態。** 現有吃完勾選只在當次頁面的記憶體，重新整理會重置；不是已存在的跨裝置資料，不能承諾搬移後保留這類勾選。
9. **原有文字不一致。** 頁面標題與描述仍提薑母鴨，manifest 說體育館海鮮碳烤；這是來源已有的差異。先保留記錄，若要統一以實際行程內容為準，不把搬移當成替使用者猜測。

## 建議執行順序與驗收

確認 repo 名稱及收錄範圍 → 在獨立工作目錄承接來源與歷史 → 新增總覽／旅行清單 → 把嘉義完整內容放到子頁 → 設定全站 PWA → 檢查手機與離線行為 → 建立確認過的 GitHub repo、推送及設定 Pages → 等待發布成功後檢查公開網址。

需要再檢查：新名稱建立時是否可用、GitHub Pages 發布是否成功、舊網址過渡策略與既有 Travel 快取修正的範圍。以上尚未執行，不能以本次研究或既有分帳測試視為新網站已驗收。

完成標準：首頁能看到嘉義並開啟；嘉義內容、帳目和烏龍均與來源一致；手機上四個分頁可操作；各個已快取頁面離線可正確重開；新增旅行只需增加子資料夾與登錄項目；manifest 安裝入口是「烏龍出遊記」總覽。
