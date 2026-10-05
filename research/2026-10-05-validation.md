# 烏龍出遊記驗收紀錄

日期：2026-10-05（Asia/Taipei）。網站及公開 repo 已建立並發布。

- 公開 repo：https://github.com/waltwait/oolong-travel
- 總覽：https://waltwait.github.io/oolong-travel/
- 嘉義：https://waltwait.github.io/oolong-travel/chiayi-2026-10/
- 本機專案：`/Users/sb/Code/Project/oolong-travel`
- 已成功部署的網站版本：`34a9c462ded802f02d986901ff11773ad68bb90d`
- GitHub Actions：`Publish Oolong Pages`，run `37331886935`，conclusion `success`。

## 已確認

1. 使用者確認公開、獨立的 `oolong-travel`，現有 Travel 為不同旅行，不共用。本站未引用 Travel 的行程、檔案或資源。
2. 嘉義來源已先拉至 `3346063`，新 repo 保留來源提交歷史；原 repo、舊網站與 Travel 未被替換。
3. 比對來源與搬移結果：Day 1、Day 2、記帳、烏龍及評分區段完全一致；封面和分帳函式 SHA-256 一致。
4. 原分帳測試成功。瀏覽器驗證 13 筆 NT$3,939、4 人每人 NT$984.75、已結清狀態、9 件烏龍與 7 筆評分。
5. 瀏覽器驗證出發前、兩個旅行日、結束後、有效／無效日期、下一趟排序、空清單與 320／390 像素手機版。
6. 停用測試瀏覽器網路後，首頁與嘉義子頁、分帳腳本和照片仍正常載入，未存過的頁面顯示離線提示。此 Chromium 的網路模擬不改 `navigator.onLine`，因此狀態提示另外透過 offline 事件驗證；離線內容本身使用真實停用的網路。
7. 新 service worker 清理本站舊快取並保留其他名稱的快取；manifest 名稱、start_url 與 scope 都指向烏龍出遊記總覽。
8. 公開首頁、嘉義子頁、manifest、192px 圖示、封面、首頁腳本和 service worker 全部回傳 HTTP 200，並核對公開 HTML 內容。
9. JS 語法、Git diff 格式與發布 workflow YAML 檢查成功。沒有新增網站產品套件相依。

## 發布方式

初次採 branch 發布，GitHub 已完成建置，但 deploy job 長時間等待 `ubuntu-latest` runner。取消本 repo 的該次等待工作，改用版本化的 `.github/workflows/pages.yml`，在 `ubuntu-22.04` 的單一 job 發布本站 `docs/`，隨後部署成功。之後 `main` 的網站檔案更新即可觸發，研究／計畫文件的更新不重複發布網站。

## 保留的原有行為

嘉義吃完勾選在重新整理後重置；帳目和烏龍紀錄由 repo 檔案管理，沒有多人即時編輯後台。其他同網域舊網站若刪除整個網域的快取，仍可能影響本站離線副本；本次依要求未修改其他 repo，本站自身只刪除自己的舊版快取。
