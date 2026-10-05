/* 單一本站快取，各頁各自存取；升級時只清理本站的舊版快取。 */
"use strict";
const PREFIX = "oolong-travel-";
const CACHE = PREFIX + "v1";
const CORE = [
  "./", "index.html", "trips.js", "manifest.webmanifest",
  "assets/journal.css", "assets/home.js", "assets/app.js",
  "assets/icons/icon.svg", "assets/icons/icon-192.png", "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png", "assets/icons/apple-touch-icon.png",
  "chiayi-2026-10/", "chiayi-2026-10/index.html", "chiayi-2026-10/settle.js", "chiayi-2026-10/cover.jpg"
];
function inScope(url) { return url.startsWith(self.registration.scope); }
function keyOf(url) { const key = new URL(url); key.hash = ""; key.search = ""; return key.href; }
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE.map(url => new URL(url, self.registration.scope).href))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", event => {
  const urls = event.data && event.data.type === "cache" && event.data.urls;
  if (!Array.isArray(urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(urls.filter(url => typeof url === "string" && inScope(url)).map(async url => {
    try { const response = await fetch(url); if (response.ok) await cache.put(keyOf(url), response); } catch (_) { /* 保留已快取版本。 */ }
  }))));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !inScope(event.request.url)) return;
  event.respondWith(networkFirst(event.request));
});
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const key = keyOf(request.url);
  const network = fetch(request).then(async response => {
    if (response.ok) await cache.put(key, response.clone());
    return response;
  });
  let timer;
  const timeout = new Promise(resolve => { timer = setTimeout(resolve, 3000); });
  const response = await Promise.race([network.catch(() => undefined), timeout]);
  clearTimeout(timer);
  if (response && response.ok) return response;
  const saved = await cache.match(key);
  if (saved) return saved;
  if (response) return response;
  try { return await network; } catch (_) {
    if (request.mode === "navigate") return new Response('<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>目前離線｜烏龍出遊記</title><body style="font-family:system-ui;padding:32px;line-height:1.7;background:#faf7f2;color:#26221d"><h1>這頁還沒存到手機</h1><p>連上網路後再打開一次，就能離線查看。</p><a href="' + self.registration.scope + '">回烏龍出遊記總覽</a></body></html>', { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
    return Response.error();
  }
}
