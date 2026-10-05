/* 本站專用的安裝、離線與預存檔案；沒有引用其他旅行網站。 */
(function () {
  "use strict";
  var base = new URL("../", document.currentScript.src);
  var offline = document.getElementById("offline");
  function updateConnection() {
    if (!offline) return;
    offline.hidden = navigator.onLine;
    offline.style.display = navigator.onLine ? "none" : "block";
  }
  updateConnection();
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(new URL("sw.js", base).href, { scope: base.href }).then(function () {
        return navigator.serviceWorker.ready;
      }).then(function (reg) {
        var urls = [location.href];
        document.querySelectorAll("a[href], img[src], script[src], link[href]").forEach(function (el) { urls.push(el.href || el.src); });
        urls = Array.from(new Set(urls.map(function (url) { return url.split("#")[0]; }))).filter(function (url) { return url.startsWith(reg.scope); });
        if (reg.active) reg.active.postMessage({ type: "cache", urls: urls });
      }).catch(function () { /* 不支援 PWA 時仍能使用網頁。 */ });
    });
  }
  var button = document.getElementById("install");
  var prompt;
  window.addEventListener("beforeinstallprompt", function (event) {
    if (!button) return;
    event.preventDefault(); prompt = event;
    button.hidden = false; button.style.display = "inline-flex";
  });
  if (button) button.addEventListener("click", function () {
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.finally(function () { prompt = undefined; button.hidden = true; button.style.display = "none"; });
  });
  window.addEventListener("appinstalled", function () {
    if (button) { button.hidden = true; button.style.display = "none"; }
    prompt = undefined;
  });
})();
