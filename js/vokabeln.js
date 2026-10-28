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

// 词类标签的中英对照
const POS_EN = {
  "名词": "noun",
  "动词": "verb",
  "形容词": "adjective",
  "连词": "conjunction",
  "副词": "adverb",
  "短语": "phrase"
};

function render() {
  const english = lang() === "en";
  const q = suche.value.trim().toLowerCase();

  const treffer = ALLE.filter(function (wort) {
    const passtKategorie = aktiveKategorie === "alle" || wort.cat === aktiveKategorie;
    const passtThema = aktivesThema === "alle" || wort.thema === aktivesThema;
    // 两种语言的释义都参与搜索，切到英文也能用中文关键词找词
    const passtSuche = q === "" ||
      wort.de.toLowerCase().includes(q) ||
      wort.zh.toLowerCase().includes(q) ||
      wort.en.toLowerCase().includes(q) ||
      wort.ex.toLowerCase().includes(q);
    return passtKategorie && passtThema && passtSuche;
  });

  tbody.textContent = "";
  treffer.forEach(function (wort) {
    const tr = document.createElement("tr");

    // 第一列用 th scope="row"：屏幕阅读器才知道这是这一行的标题
    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = wort.de;
    tr.appendChild(th);

    const tdPos = document.createElement("td");
    tdPos.textContent = english ? (POS_EN[wort.pos] || wort.pos) : wort.pos;
    tr.appendChild(tdPos);

    const tdBedeutung = document.createElement("td");
    tdBedeutung.textContent = english ? wort.en : wort.zh;
    tr.appendChild(tdBedeutung);

    const tdBeispiel = document.createElement("td");
    tdBeispiel.className = "beispiel";
    tdBeispiel.lang = "de";
    tdBeispiel.textContent = wort.ex || "—";   // 新导入的 B1 词暂无例句
    tr.appendChild(tdBeispiel);

    tbody.appendChild(tr);
  });

  if (treffer.length === 0) {
    anzahl.textContent = english ? "no matches — try another keyword" : "没有匹配的词条 —— 试试别的关键词";
  } else {
    anzahl.textContent = english
      ? treffer.length + " of " + ALLE.length + " entries"
      : treffer.length + " / 共 " + ALLE.length + " 个词条";
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
    render();
  });
});

themaButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktivesThema = button.dataset.thema;
    setPressed(themaButtons, button);
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

render();
