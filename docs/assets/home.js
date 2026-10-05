(function () {
  "use strict";
  var DAY = 86400000;
  function validDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + "T00:00:00Z")) &&
      new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;
  }
  function dayDiff(a, b) { return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / DAY); }
  function stateAt(trip, date) { return date < trip.start ? "upcoming" : date <= trip.end ? "ongoing" : "past"; }
  function today() {
    var override = new URLSearchParams(location.search).get("today");
    if (validDate(override)) return override;
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    var date = {}; parts.forEach(function (part) { date[part.type] = part.value; });
    return date.year + "-" + date.month + "-" + date.day;
  }
  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function dates(trip) {
    var p = element("p", "trip-date");
    var start = element("time", "", trip.start.replace(/-/g, "/")); start.dateTime = trip.start;
    var end = element("time", "", (trip.start.slice(0, 4) === trip.end.slice(0, 4) ? trip.end.slice(5) : trip.end).replace(/-/g, "/")); end.dateTime = trip.end;
    p.append(start, "–", end);
    var nights = dayDiff(trip.start, trip.end);
    p.append(element("span", "", nights ? (nights + 1) + " 天 " + nights + " 夜" : "一日遊"));
    return p;
  }
  function render(trips, date) {
    var ordered = trips.slice().sort(function (a, b) { return b.start.localeCompare(a.start); });
    var cards = document.createDocumentFragment();
    ordered.forEach(function (trip, i) {
      var state = stateAt(trip, date);
      var li = element("li", "trip"); li.dataset.state = state;
      var link = element("a", "trip-link"); link.href = trip.slug + "/";
      var photo = element("div", "trip-photo");
      var img = element("img"); img.src = trip.cover; img.alt = trip.coverAlt || trip.destination; img.width = 1600; img.height = 1200;
      if (i > 0) img.loading = "lazy";
      photo.append(img, element("span", "trip-status", { upcoming: "即將出發", ongoing: "出遊中", past: "旅行回憶" }[state]));
      var story = element("div", "trip-story");
      story.append(element("span", "trip-place", trip.destination), element("h3", "", trip.title), dates(trip), element("p", "trip-summary", trip.summary));
      var open = element("span", "trip-open", "打開這趟出遊記 ");
      var arrow = element("span", "", "↗"); arrow.setAttribute("aria-hidden", "true"); open.append(arrow); story.append(open);
      link.append(photo, story); li.append(link); cards.append(li);
    });
    document.getElementById("trips").replaceChildren(cards);
    document.getElementById("trip-count").textContent = trips.length + " 趟旅行";
    var next = trips.filter(function (trip) { return stateAt(trip, date) === "ongoing"; }).sort(function (a, b) { return a.start.localeCompare(b.start); })[0] ||
      trips.filter(function (trip) { return stateAt(trip, date) === "upcoming"; }).sort(function (a, b) { return a.start.localeCompare(b.start); })[0];
    var panel = document.getElementById("next-trip");
    if (!next) {
      document.getElementById("next-heading").textContent = "下一趟";
      panel.replaceChildren(element("p", "next-empty", "還沒決定去哪裡，先把這次的故事收好。"));
      return;
    }
    var state = stateAt(next, date);
    document.getElementById("next-heading").textContent = state === "ongoing" ? "出遊中" : "下一趟";
    var title = element("a", "next-title", next.destination + "｜" + next.title); title.href = next.slug + "/";
    var days = dayDiff(date, next.start);
    var note = state === "ongoing" ? "今天是第 " + (dayDiff(next.start, date) + 1) + " 天" : days === 1 ? "明天出發" : "還有 " + days + " 天出發";
    panel.replaceChildren(title, element("p", "next-note", note + "　" + next.start.replace(/-/g, "/") + "–" + next.end.replace(/-/g, "/")));
  }
  window.OolongHome = { stateAt: stateAt, validDate: validDate, render: render };
  render(window.OOLONG_TRIPS || [], today());
})();
