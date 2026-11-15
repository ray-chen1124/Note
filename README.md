# 電子學筆記

大學電子學複習站。可以依分類或關鍵字找筆記，每篇有核心觀念、公式與適用條件、例題和常見錯誤。例題附可展開的解題步驟。

## 開啟與擴充

- 直接開啟 `index.html`，或在專案根目錄執行 `python -m http.server 8080`，再開啟 `http://localhost:8080`。
- 新增筆記先讀 [AGENTS.md](./AGENTS.md)，再由 [筆記範本](./templates/note-template.js) 建立一筆資料。新增後執行 `node scripts/check-notes.cjs`。
## 內容來源

- 半導體基礎、PN 接面、兩種載子傳輸、空乏區與接面電容，以及二極體模型等五篇，依上傳的《2018 PN Junction 及基本半導體》整理，逐篇列出 PDF 頁碼與例題來源。原稿中可辨識的課本圖出自 Sedra 與 Smith 的《Microelectronic Circuits》國際第六版，公開筆記使用重述的文字。
- NPN 偏壓、反相放大器和齊納二極體穩壓三篇為專案初版的示範筆記，例題為自製題目。
- 生成式 AI 協助整理內容、驗算例題、排版及製作網頁與擴充規則。

## GitHub Pages

將本專案的檔案放在公開儲存庫的 `main` 分支根目錄。在 Settings → Pages 選擇 Deploy from a branch，指定 `main` 與 `/(root)` 後儲存。部署完成後，從 Pages 設定開啟網站網址，確認首頁、搜尋與筆記頁均可瀏覽。
