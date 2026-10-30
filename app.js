/* =========================================================
   LOGIC: draws the page from the data in content.js.
   Normally you do not need to touch this file.
   ========================================================= */

let lang = "en";
let selected = BIRTHDAY;      // the open day (or null)
let selectedPlace = null;     // the open place, e.g. "Covilhã" (or null). Only one panel is open at a time.

const $ = (id) => document.getElementById(id);

function keyOf(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function dateFromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Turns TIMELINE into a flat list: date keys ("2027-04-16") and "gap" markers
function buildTimeline() {
  const items = [];
  for (const seg of TIMELINE) {
    if (seg === "gap") { items.push("gap"); continue; }
    const end = dateFromKey(seg.to);
    for (let d = dateFromKey(seg.from); d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      items.push(keyOf(d));
    }
  }
  return items;
}

// Color group of a day: "party" (purple), "quiet" (plain: flights and explore days), "plan" (yellow: everything else)
function kindOf(ev) {
  if (ev && ev.type === "party") return "party";
  if (ev && (ev.type === "travel" || ev.type === "note")) return "quiet";
  return "plan";
}

// Index of the LOCATIONS entry for a day, or null. The last matching entry wins.
function locationFor(key) {
  let found = null;
  LOCATIONS.forEach((loc, i) => { if (key >= loc.from && key <= loc.to) found = i; });
  return found;
}

function pickLang() {
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return I18N[nav] ? nav : "en";
}

function daysUntilBirthday() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((dateFromKey(BIRTHDAY) - today) / 86400000);
}

function renderStatic() {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.title = t.heroTitle;
  $("heroTitle").textContent = t.heroTitle;
  $("heroDate").textContent = new Intl.DateTimeFormat(t.locale, { day: "numeric", month: "long", year: "numeric" }).format(dateFromKey(BIRTHDAY));
  $("countdown").textContent = t.countdown(daysUntilBirthday());
  $("weekTitle").textContent = t.weekTitle;
  $("notice").textContent = t.notice || "";
  $("notice").hidden = !t.notice;
  $("hint").textContent = t.hint;
  $("scrollHint").textContent = t.scrollHint || "";
  $("daysPrev").setAttribute("aria-label", t.prevDays || "Previous days");
  $("daysNext").setAttribute("aria-label", t.nextDays || "Next days");
  $("footer").textContent = t.footer;
  document.querySelectorAll("#lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
}

function renderDays() {
  const t = I18N[lang];
  const wrap = $("days");
  wrap.innerHTML = "";

  const items = buildTimeline();

  // The row is a grid: one column per day (or per "···"), squares in row 1, location band in row 2
  wrap.style.gridTemplateColumns = items.map((it) => (it === "gap" ? "34px" : "minmax(104px, 1fr)")).join(" ");

  // Which LOCATIONS entry each column belongs to. A "···" joins the band if both sides match.
  const locIdx = items.map((it) => (it === "gap" ? null : locationFor(it)));
  items.forEach((it, i) => {
    if (it === "gap" && i > 0 && i < items.length - 1 && locIdx[i - 1] === locIdx[i + 1]) locIdx[i] = locIdx[i - 1];
  });

  for (let col = 0; col < items.length; col++) {
    const item = items[col];
    if (item === "gap") {
      const gap = document.createElement("div");
      gap.className = "gap";
      gap.setAttribute("aria-hidden", "true");
      gap.style.gridColumn = String(col + 1);
      gap.style.gridRow = "1";
      gap.textContent = "···";
      wrap.appendChild(gap);
      continue;
    }

    const key = item;
    const date = dateFromKey(key);
    const ev = EVENTS[key];
    const locked = LOCKED.includes(key);
    const isOpen = !locked && key === selected;

    const btn = document.createElement("button");
    btn.className = "day " + kindOf(ev)
      + (key === BIRTHDAY ? " birthday" : "")
      + (locked ? " locked" : "");
    if (locked) btn.disabled = true;
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.setAttribute("aria-controls", "panel");
    btn.dataset.key = key;
    btn.style.gridColumn = String(col + 1);
    btn.style.gridRow = "1";

    const top = document.createElement("div");
    const wd = document.createElement("div");
    wd.className = "wd";
    wd.textContent = `${t.weekdays[date.getDay()]} · ${t.months[date.getMonth()]}`;
    const num = document.createElement("div");
    num.className = "num";
    num.textContent = date.getDate();
    top.append(wd, num);

    const bottom = document.createElement("div");
    const tag = document.createElement("div");
    tag.className = "tag";
    if (locked) tag.textContent = "🔒 " + t.lockedTag;
    else tag.textContent = ev && ev.tag ? (ev.icon || "🎉") + " " + ev.tag[lang] : " ";
    const arrow = document.createElement("div");
    arrow.className = "arrow";
    arrow.textContent = locked ? " " : (isOpen ? "▲" : "▼");
    bottom.append(tag, arrow);

    btn.append(top, bottom);
    btn.addEventListener("click", () => {
      selected = selected === key ? null : key;
      if (selected) selectedPlace = null;
      renderDays();
      renderPanel();
    });
    wrap.appendChild(btn);
  }

  // Location band: one block per run of columns with the same place
  let start = 0;
  while (start < items.length) {
    const idx = locIdx[start];
    let end = start;
    while (end + 1 < items.length && locIdx[end + 1] === idx) end++;
    if (idx !== null) {
      const loc = LOCATIONS[idx];
      const place = PLACES[loc.name];                 // has an info panel? then the band is clickable
      const isPlaceOpen = !!place && selectedPlace === loc.name;
      const band = document.createElement(place ? "button" : "div");
      band.className = "loc" + (place ? " clickable" : "");
      if (place) {
        band.setAttribute("aria-expanded", String(isPlaceOpen));
        band.setAttribute("aria-controls", "panel");
        band.addEventListener("click", () => {
          selectedPlace = selectedPlace === loc.name ? null : loc.name;
          if (selectedPlace) selected = null;
          renderDays();
          renderPanel();
        });
      }
      band.style.gridColumn = `${start + 1} / ${end + 2}`;
      band.style.gridRow = "2";
      band.style.backgroundColor = loc.color;
      if (loc.image) {
        band.style.backgroundImage = `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url("${loc.image}")`;
        band.style.backgroundSize = "cover";
        band.style.backgroundPosition = "center";
      }
      const label = document.createElement("span");
      label.className = "loc-label";
      label.textContent = "📍 " + loc.name + (place ? (isPlaceOpen ? "  ▲" : "  ▼") : "");
      band.appendChild(label);
      wrap.appendChild(band);
    }
    start = end + 1;
  }
}

// Text blocks (a small title, then a list and/or a paragraph). Used in place panels and day panels.
function appendBlocks(panel, blocks) {
  for (const b of blocks) {
    const h4 = document.createElement("h4");
    h4.textContent = b.title;
    panel.appendChild(h4);
    if (b.items) {
      const ul = document.createElement("ul");
      ul.className = "place-list";
      (b.items[lang] || []).forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        ul.appendChild(li);
      });
      panel.appendChild(ul);
    }
    if (b.text) {
      const p = document.createElement("p");
      p.textContent = b.text[lang];
      panel.appendChild(p);
    }
  }
}

// "sections" from content.js -> blocks in the current language
function sectionBlocks(sections) {
  return (sections || []).map((s) => ({ title: s.title[lang], text: s.text, items: s.items }));
}

// Link buttons. "extra" is one more finished link element added at the end (e.g. the Google Maps link).
function appendLinks(panel, links, extra) {
  const wrap = document.createElement("div");
  wrap.className = "place-links";
  (links || []).forEach((l) => {
    const a = document.createElement("a");
    a.className = "place-link";
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "🔗 " + l.label[lang];
    wrap.appendChild(a);
  });
  if (extra) wrap.appendChild(extra);
  if (wrap.children.length) panel.appendChild(wrap);
}

// Builds the content of a place panel into "panel".
// measure = true: nothing is loaded, grey boxes of the same size stand in for photo and map
// (only used to measure how tall the panel gets, see fitPanelSlot)
function fillPlacePanel(panel, name, measure) {
  const t = I18N[lang];
  const place = PLACES[name];
  const loc = LOCATIONS.find((l) => l.name === name);

  const h = document.createElement("h3");
  h.textContent = "📍 " + name;
  panel.appendChild(h);

  // photo and map side by side
  const media = document.createElement("div");
  media.className = "place-media";
  const src = place.photo || (loc && loc.image);
  const fallback = loc && loc.image && loc.image !== src ? loc.image : null;
  if (src) {
    if (measure) {
      const box = document.createElement("div");
      box.className = "ph";
      media.appendChild(box);
    } else {
      const img = document.createElement("img");
      img.alt = name;
      img.src = src;
      img.addEventListener("error", () => {
        if (fallback && img.getAttribute("src") !== fallback) img.src = fallback;   // your picture is missing: use the band picture
        else img.remove();                                                          // nothing to show: just the map
      });
      media.appendChild(img);
    }
  }
  const query = encodeURIComponent(place.map || name);
  if (measure) {
    const box = document.createElement("div");
    box.className = "ph";
    media.appendChild(box);
  } else {
    const frame = document.createElement("iframe");
    frame.src = `https://maps.google.com/maps?q=${query}&z=${place.zoom || 13}&output=embed`;
    frame.title = name;
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    media.appendChild(frame);
  }
  panel.appendChild(media);

  // text blocks: "stay" and "how" first (if present), then the "sections" list
  const blocks = [];
  if (place.stay) blocks.push({ title: t.stayTitle, text: place.stay });
  if (place.how) blocks.push({ title: t.howTitle, text: place.how });
  sectionBlocks(place.sections).forEach((blk) => blocks.push(blk));
  appendBlocks(panel, blocks);

  // links: your own (optional) and the Google Maps link
  const mapLink = document.createElement("a");
  mapLink.className = "place-link";
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  mapLink.target = "_blank";
  mapLink.rel = "noopener";
  mapLink.textContent = "📍 " + t.openMap;
  appendLinks(panel, place.links, mapLink);
}

// Panel for a place: photo + Google map side by side, then the text blocks
function renderPlacePanel() {
  const panel = $("panel");
  const loc = LOCATIONS.find((l) => l.name === selectedPlace);
  panel.hidden = false;
  panel.className = "panel place";
  panel.style.borderColor = loc ? loc.color : "";
  panel.innerHTML = "";
  fillPlacePanel(panel, selectedPlace, false);
}

// Keeps the area under the days as tall as the tallest panel (every place and every day, in the current
// language and screen width), so opening and closing a panel never moves the rest of the page.
function fitPanelSlot() {
  const slot = document.querySelector(".panel-slot");
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;";
  slot.appendChild(probe);
  let tallest = 0;
  const measure = () => { tallest = Math.max(tallest, probe.offsetHeight); };
  for (const name of Object.keys(PLACES)) {
    probe.className = "panel place";
    probe.innerHTML = "";
    fillPlacePanel(probe, name, true);
    measure();
  }
  for (const key of buildTimeline()) {
    if (key === "gap") continue;
    probe.className = "panel " + kindOf(EVENTS[key]);
    probe.innerHTML = "";
    fillDayPanel(probe, key, true);
    measure();
  }
  probe.remove();
  if (tallest) slot.style.minHeight = (tallest + 6 + 4) + "px";   // +6 = the panel's top margin
}

// Builds the content of a day panel into "panel" (key = "2027-04-25"). measure = true: grey box instead of the photo.
function fillDayPanel(panel, key, measure) {
  const t = I18N[lang];
  const date = dateFromKey(key);
  const longDate = new Intl.DateTimeFormat(t.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
  const ev = EVENTS[key];

  const h = document.createElement("h3");
  h.textContent = ev ? ev.title[lang] : t.emptyTitle;
  const when = document.createElement("p");
  when.className = "when";
  when.textContent = longDate;
  panel.append(h, when);

  // optional photo for the day (see "photo" in the 25 April event)
  if (ev && ev.photo) {
    const pic = document.createElement(measure ? "div" : "img");
    pic.className = "event-photo";
    if (!measure) {
      pic.alt = ev.title[lang];
      pic.src = ev.photo;
      pic.addEventListener("error", () => pic.remove());   // missing file: no photo
    }
    panel.appendChild(pic);
  }

  if (ev && (ev.when || ev.where)) {
    const dl = document.createElement("dl");
    if (ev.when) {
      const dt = document.createElement("dt"); dt.textContent = t.when;
      const dd = document.createElement("dd"); dd.textContent = ev.when[lang];
      dl.append(dt, dd);
    }
    if (ev.where) {
      const dt = document.createElement("dt"); dt.textContent = t.where;
      const dd = document.createElement("dd"); dd.textContent = ev.where[lang];
      dl.append(dt, dd);
    }
    panel.appendChild(dl);
  }

  if (!ev || ev.text) {
    const p = document.createElement("p");
    p.textContent = ev ? ev.text[lang] : t.emptyText;
    panel.appendChild(p);
  }

  if (ev) {
    appendBlocks(panel, sectionBlocks(ev.sections));   // optional extra blocks (see the 25 April event)
    appendLinks(panel, ev.links);                      // optional link buttons
  }
}

function renderPanel() {
  const panel = $("panel");
  panel.style.borderColor = "";
  if (selectedPlace && PLACES[selectedPlace]) { renderPlacePanel(); return; }
  if (!selected) { panel.hidden = true; return; }
  panel.hidden = false;
  panel.className = "panel " + kindOf(EVENTS[selected]);
  panel.innerHTML = "";
  fillDayPanel(panel, selected);
}

function renderAll() { renderStatic(); renderDays(); renderPanel(); fitPanelSlot(); }

document.querySelectorAll("#lang button").forEach((b) =>
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    renderAll();
  })
);

let resizeTimer;
window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitPanelSlot, 120); });

lang = pickLang();
renderAll();

// On load, scroll the day row so the selected day (the birthday) is centered
(function () {
  const strip = $("days");
  const sel = strip.querySelector('.day[aria-expanded="true"]');
  if (sel) {
    const offset = sel.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft;
    strip.scrollLeft = offset - strip.clientWidth / 2 + sel.clientWidth / 2;
  }
})();

// Arrows, edge fades and hint for the day row: shown only when there is more to scroll to
(function () {
  const strip = $("days"), wrap = strip.parentElement, prev = $("daysPrev"), next = $("daysNext"), hint = $("scrollHint");
  function update() {
    const max = strip.scrollWidth - strip.clientWidth;
    const canPrev = strip.scrollLeft > 4, canNext = strip.scrollLeft < max - 4;
    prev.hidden = !canPrev;
    next.hidden = !canNext;
    wrap.classList.toggle("can-prev", canPrev);
    wrap.classList.toggle("can-next", canNext);
    if (max <= 4) hint.classList.add("gone");
  }
  const go = (dir) => strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: "smooth" });
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  let ready = false, startPos = 0;
  strip.addEventListener("scroll", () => {
    update();
    // hide the hint once the visitor has scrolled (opacity only, so the page never jumps)
    if (ready && Math.abs(strip.scrollLeft - startPos) > 24) hint.classList.add("gone");
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
  setTimeout(() => { update(); startPos = strip.scrollLeft; ready = true; }, 300);
})();
