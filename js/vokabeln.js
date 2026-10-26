// 词汇表：数据 + 搜索/筛选 + 中英双语
// 每个词条：
//   de  德语词条
//   pos 词类（中文，用于显示）
//   zh  中文释义
//   en  英文释义（英文模式下显示）
//   ex  例句
//   cat 筛选用的类别
const VOKABELN = [
  { de: "die Erfahrung, -en", pos: "名词", zh: "经验", en: "experience", ex: "Ich habe schon viel Erfahrung mit Gruppenarbeit.", cat: "nomen" },
  { de: "der Erfolg, -e", pos: "名词", zh: "成功", en: "success", ex: "Der Erfolg kommt nicht über Nacht.", cat: "nomen" },
  { de: "die Bewerbung, -en", pos: "名词", zh: "申请（求职/入学）", en: "application (job / university)", ex: "Ich schreibe gerade meine Bewerbung für ein Praktikum.", cat: "nomen" },
  { de: "der Termin, -e", pos: "名词", zh: "预约；约定的时间", en: "appointment; agreed time", ex: "Ich habe morgen einen Termin beim Arzt.", cat: "nomen" },
  { de: "die Umgebung, -en", pos: "名词", zh: "环境；周边", en: "surroundings; area", ex: "Die Umgebung hier ist sehr ruhig.", cat: "nomen" },
  { de: "der Vorteil, -e", pos: "名词", zh: "优点", en: "advantage", ex: "Ein Vorteil von Karteikarten ist, dass man überall lernen kann.", cat: "nomen" },
  { de: "der Nachteil, -e", pos: "名词", zh: "缺点", en: "disadvantage", ex: "Der Nachteil ist, dass es viel Zeit kostet.", cat: "nomen" },
  { de: "die Möglichkeit, -en", pos: "名词", zh: "可能性；机会", en: "possibility; opportunity", ex: "Es gibt viele Möglichkeiten, Deutsch zu lernen.", cat: "nomen" },
  { de: 'der Zusammenhang, “-e”', pos: "名词", zh: "关联；联系", en: "connection; context", ex: "Ich sehe keinen Zusammenhang zwischen den beiden Problemen.", cat: "nomen" },
  { de: "die Entscheidung, -en", pos: "名词", zh: "决定", en: "decision", ex: "Das war eine schwierige Entscheidung.", cat: "nomen" },
  { de: "die Prüfung, -en", pos: "名词", zh: "考试", en: "exam", ex: "Ich bereite mich auf die B1-Prüfung vor.", cat: "nomen" },
  { de: "die Aufgabe, -n", pos: "名词", zh: "任务；作业", en: "task; exercise", ex: "Die Aufgabe war schwieriger als gedacht.", cat: "nomen" },

  { de: "sich bewerben (um + Akk.)", pos: "动词", zh: "申请", en: "to apply (for)", ex: "Ich bewerbe mich um einen Studienplatz.", cat: "verben" },
  { de: "teilnehmen (an + Dat.)", pos: "动词", zh: "参加", en: "to take part (in)", ex: "Ich nehme an einem Deutschkurs teil.", cat: "verben" },
  { de: "sich interessieren für", pos: "动词", zh: "对……感兴趣", en: "to be interested in", ex: "Ich interessiere mich für deutsche Musik.", cat: "verben" },
  { de: "stattfinden", pos: "动词", zh: "举行；发生", en: "to take place", ex: "Der Kurs findet am Montag statt.", cat: "verben" },
  { de: "verschieben", pos: "动词", zh: "推迟；挪动", en: "to postpone; to move", ex: "Wir müssen den Termin verschieben.", cat: "verben" },
  { de: "sich entscheiden (für)", pos: "动词", zh: "决定；选择", en: "to decide (on)", ex: "Ich habe mich für den B1-Kurs entschieden.", cat: "verben" },
  { de: "zunehmen", pos: "动词", zh: "增加", en: "to increase", ex: "Die Zahl der Studierenden nimmt zu.", cat: "verben" },
  { de: "erreichen", pos: "动词", zh: "达到；够到", en: "to reach", ex: "Ich will das B1-Niveau erreichen.", cat: "verben" },
  { de: "sich vorbereiten (auf + Akk.)", pos: "动词", zh: "准备", en: "to prepare (for)", ex: "Ich bereite mich auf die Prüfung vor.", cat: "verben" },
  { de: "empfehlen", pos: "动词", zh: "推荐", en: "to recommend", ex: "Kannst du mir ein Buch empfehlen?", cat: "verben" },
  { de: "üben", pos: "动词", zh: "练习", en: "to practise", ex: "Ich übe jeden Tag eine Stunde.", cat: "verben" },

  { de: "zuverlässig", pos: "形容词", zh: "可靠的", en: "reliable", ex: "Er ist ein zuverlässiger Kollege.", cat: "adjektive" },
  { de: "anstrengend", pos: "形容词", zh: "累人的；费力的", en: "exhausting", ex: "Der Tag war sehr anstrengend.", cat: "adjektive" },
  { de: "deutlich", pos: "形容词", zh: "清楚的；明确的", en: "clear; distinct", ex: "Sprich bitte deutlich.", cat: "adjektive" },
  { de: "geduldig", pos: "形容词", zh: "有耐心的", en: "patient", ex: "Man muss geduldig sein, wenn man eine Sprache lernt.", cat: "adjektive" },

  { de: "obwohl", pos: "连词", zh: "尽管（从句，动词到句末）", en: "although (verb goes to the end)", ex: "Obwohl es regnet, gehe ich joggen.", cat: "sonstiges" },
  { de: "deshalb", pos: "副词", zh: "因此", en: "therefore", ex: "Ich habe früh angefangen, deshalb bin ich fertig.", cat: "sonstiges" },
  { de: "außerdem", pos: "副词", zh: "此外", en: "besides; also", ex: "Außerdem lese ich jeden Tag Nachrichten.", cat: "sonstiges" },
  { de: "trotzdem", pos: "副词", zh: "尽管如此", en: "nevertheless", ex: "Es war spät, trotzdem bin ich noch gelaufen.", cat: "sonstiges" }
];

const tbody = document.querySelector("#vokabel-tbody");
const suche = document.querySelector("#suche");
const anzahl = document.querySelector("#anzahl");
const filterButtons = document.querySelectorAll("[data-filter]");

let aktiveKategorie = "alle";

// 当前语言（由 js/i18n.js 提供；没加载 i18n.js 时退回中文）
function lang() {
  return window.i18n && window.i18n.lang === "en" ? "en" : "zh";
}

// 词类标签的中英对照
const POS_EN = {
  "名词": "noun",
  "动词": "verb",
  "形容词": "adjective",
  "连词": "conjunction",
  "副词": "adverb"
};

function render() {
  const english = lang() === "en";
  const q = suche.value.trim().toLowerCase();

  const treffer = VOKABELN.filter(function (wort) {
    const passtKategorie = aktiveKategorie === "alle" || wort.cat === aktiveKategorie;
    // 两种语言的释义都参与搜索，切到英文也能用中文关键词找词
    const passtSuche = q === "" ||
      wort.de.toLowerCase().includes(q) ||
      wort.zh.toLowerCase().includes(q) ||
      wort.en.toLowerCase().includes(q) ||
      wort.ex.toLowerCase().includes(q);
    return passtKategorie && passtSuche;
  });

  tbody.textContent = "";
  treffer.forEach(function (wort) {
    const tr = document.createElement("tr");

    // 第一列：德语词条（用 th scope="row"，屏幕阅读器才知道这是这一行的标题）
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
    tdBeispiel.textContent = wort.ex;
    tr.appendChild(tdBeispiel);

    tbody.appendChild(tr);
  });

  // 结果计数（aria-live 会把它读给屏幕阅读器）
  if (treffer.length === 0) {
    anzahl.textContent = english ? "no matches — try another keyword" : "没有匹配的词条 —— 试试别的关键词";
  } else {
    anzahl.textContent = english ? treffer.length + " entries" : treffer.length + " 个词条";
  }
}

suche.addEventListener("input", render);

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktiveKategorie = button.dataset.filter;
    filterButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === button));
    });
    render();
  });
});

// 切换语言时重新渲染表格（表格内容是脚本生成的，不会自动跟着 i18n 变）
document.addEventListener("languagechange", function (event) {
  // 被筛选按钮过滤时保持当前筛选，只换语言
  if (event.detail && event.detail.lang) {
    render();
  }
});

render();
