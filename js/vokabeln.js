// 词汇表：渲染 + 搜索 + 双重筛选（词类 / 主题）
// 数据在 js/vokabeln-data.js 里（来自我自己的课本笔记），本文件只负责显示和筛选。
const tbody = document.querySelector("#vokabel-tbody");
const suche = document.querySelector("#suche");
const anzahl = document.querySelector("#anzahl");
const catButtons = document.querySelectorAll("[data-filter]");    // 词类
const themaButtons = document.querySelectorAll("[data-thema]");   // 主题

// 三个数据文件（必须在加载本文件之前引入）：主词表 + B1 高频词两批
const ALLE = VOKABELN.concat(VOKABELN_B1, VOKABELN_B1_2, VOKABELN_B1_3, VOKABELN_B1_4, VOKABELN_B1_5, VOKABELN_B1_6, VOKABELN_B1_7);

let aktiveKategorie = "alle";
let aktivesThema = "alle";

// 当前语言（由 js/i18n.js 提供；没加载时退回中文）
function lang() {
  return window.i18n && window.i18n.lang === "en" ? "en" : "zh";
}


// 搜索归一化：大小写、变音符号（ä ö ü → a o u）、ß → ss、以及 ae/oe/ue 写法
// 都能匹配上。这样输入 "kase"、"käse"、"kaese" 都能找到 Käse。
function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u");
}

// 词类标签的中英对照
const POS_EN = {
  "名词": "noun",
  "动词": "verb",
  "形容词": "adjective",
  "连词": "conjunction",
  "副词": "adverb",
  "短语": "phrase"
};


// 把命中的片段用 <mark> 包起来：搜 arbeit 时，例句里的 arbeiten 会亮起来，
// 用户立刻知道"这行为什么被搜出来"。
function mitMarkierung(text, query) {
  const frag = document.createDocumentFragment();
  if (!query) { frag.appendChild(document.createTextNode(text)); return frag; }
  const lower = String(text).toLowerCase();
  const q = query.toLowerCase();
  let from = 0, idx = lower.indexOf(q);
  if (idx < 0) { frag.appendChild(document.createTextNode(text)); return frag; }
  while (idx >= 0) {
    frag.appendChild(document.createTextNode(text.slice(from, idx)));
    const m = document.createElement("mark");
    m.textContent = text.slice(idx, idx + q.length);
    frag.appendChild(m);
    from = idx + q.length;
    idx = lower.indexOf(q, from);
  }
  frag.appendChild(document.createTextNode(text.slice(from)));
  return frag;
}

function render() {
  const english = lang() === "en";
  const qRaw = suche.value.trim();
  const q = norm(qRaw);

  const treffer = ALLE.filter(function (wort) {
    const passtKategorie = aktiveKategorie === "alle" || wort.cat === aktiveKategorie;
    const passtThema = aktivesThema === "alle" || wort.thema === aktivesThema;
    // 两种语言的释义都参与搜索，切到英文也能用中文关键词找词
    const passtSuche = qRaw === "" ||
      norm(wort.de).includes(q) ||
      norm(wort.zh).includes(q) ||
      norm(wort.en).includes(q) ||
      norm(wort.ex).includes(q);
    return passtKategorie && passtThema && passtSuche;
  });

  tbody.textContent = "";
  treffer.forEach(function (wort) {
    const tr = document.createElement("tr");

    // 第一列用 th scope="row"：屏幕阅读器才知道这是这一行的标题
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(mitMarkierung(wort.de, qRaw));
    tr.appendChild(th);

    const tdPos = document.createElement("td");
    tdPos.textContent = english ? (POS_EN[wort.pos] || wort.pos) : wort.pos;
    tr.appendChild(tdPos);

    const tdBedeutung = document.createElement("td");
    tdBedeutung.appendChild(mitMarkierung(english ? wort.en : wort.zh, qRaw));
    tr.appendChild(tdBedeutung);

    const tdBeispiel = document.createElement("td");
    tdBeispiel.className = "beispiel";
    tdBeispiel.lang = "de";
    if (wort.ex) {
      tdBeispiel.appendChild(mitMarkierung(wort.ex, qRaw));
    } else {
      tdBeispiel.textContent = "—";             // 少数 B1 词暂无例句
    }
    tr.appendChild(tdBeispiel);

    tbody.appendChild(tr);
  });

  // 当前生效的筛选，用文字说明出来（否则用户会以为"搜索坏了"）
  const aktiv = [];
  if (aktiveKategorie !== "alle") {
    aktiv.push(english ? "word class" : "词类");
  }
  if (aktivesThema !== "alle") {
    aktiv.push(english ? "topic" : "主题");
  }

  if (treffer.length === 0) {
    if (aktiv.length) {
      anzahl.textContent = english
        ? "No match — the " + aktiv.join(" + ") + " filter is still on."
        : "没有匹配 —— " + aktiv.join("、") + "筛选还开着。";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clear-filter";
      btn.textContent = english ? "Clear filters" : "清除筛选";
      btn.addEventListener("click", function () {
        aktiveKategorie = "alle";
        aktivesThema = "alle";
        setPressed(catButtons, document.querySelector('[data-filter="alle"]'));
        setPressed(themaButtons, document.querySelector('[data-thema="alle"]'));
        // 支持 ?q=arbeit 直接带搜索词打开（也方便演示时直接跳到一个已搜好的状态）
(function sucheAusUrl() {
  const q = new URLSearchParams(window.location.search).get("q");
  if (q) {
    suche.value = q;
  }
})();

render();
        suche.focus();
      });
      anzahl.appendChild(document.createTextNode(" "));
      anzahl.appendChild(btn);
    } else {
      anzahl.textContent = english ? "no matches — try another keyword" : "没有匹配的词条 —— 试试别的关键词";
    }
  } else {
    const suffix = aktiv.length
      ? (english ? " (" + aktiv.join(" + ") + " filter on)" : "（已按" + aktiv.join("、") + "筛选）")
      : "";
    anzahl.textContent = (english
      ? treffer.length + " of " + ALLE.length + " entries"
      : treffer.length + " / 共 " + ALLE.length + " 个词条") + suffix;
  }
}

function setPressed(buttons, active) {
  buttons.forEach(function (b) {
    b.setAttribute("aria-pressed", String(b === active));
  });
}

suche.addEventListener("input", render);

catButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktiveKategorie = button.dataset.filter;
    setPressed(catButtons, button);
    // 支持 ?q=arbeit 直接带搜索词打开（也方便演示时直接跳到一个已搜好的状态）
(function sucheAusUrl() {
  const q = new URLSearchParams(window.location.search).get("q");
  if (q) {
    suche.value = q;
  }
})();

render();
  });
});

themaButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktivesThema = button.dataset.thema;
    setPressed(themaButtons, button);
    // 支持 ?q=arbeit 直接带搜索词打开（也方便演示时直接跳到一个已搜好的状态）
(function sucheAusUrl() {
  const q = new URLSearchParams(window.location.search).get("q");
  if (q) {
    suche.value = q;
  }
})();

render();
  });
});

// 切换语言时重新渲染（表格是脚本生成的，不会自动跟着 i18n 变）
document.addEventListener("languagechange", render);

// 支持从链接直达某个主题，例如 vokabeln.html?thema=wetter（笔记页的五条链接就用这个）
(function themaAusUrl() {
  const ausUrl = new URLSearchParams(window.location.search).get("thema");
  if (!ausUrl) return;
  const knopf = document.querySelector('[data-thema="' + ausUrl + '"]');
  if (knopf) {
    aktivesThema = ausUrl;
    setPressed(themaButtons, knopf);
  }
})();

// 支持 ?q=arbeit 直接带搜索词打开（也方便演示时直接跳到一个已搜好的状态）
(function sucheAusUrl() {
  const q = new URLSearchParams(window.location.search).get("q");
  if (q) {
    suche.value = q;
  }
})();

render();
