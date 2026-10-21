// 词汇表数据 + 搜索/筛选
// 每个词条：de 德语词条、pos 词类标签、zh 中文、ex 例句、cat 筛选用的类别
const VOKABELN = [
  { de: "die Erfahrung, -en", pos: "名词", zh: "经验", ex: "Ich habe schon viel Erfahrung mit Gruppenarbeit.", cat: "nomen" },
  { de: "der Erfolg, -e", pos: "名词", zh: "成功", ex: "Der Erfolg kommt nicht über Nacht.", cat: "nomen" },
  { de: "die Bewerbung, -en", pos: "名词", zh: "申请（求职/入学）", ex: "Ich schreibe gerade meine Bewerbung für ein Praktikum.", cat: "nomen" },
  { de: "der Termin, -e", pos: "名词", zh: "预约；约定的时间", ex: "Ich habe morgen einen Termin beim Arzt.", cat: "nomen" },
  { de: "die Umgebung, -en", pos: "名词", zh: "环境；周边", ex: "Die Umgebung hier ist sehr ruhig.", cat: "nomen" },
  { de: "der Vorteil, -e", pos: "名词", zh: "优点", ex: "Ein Vorteil von Karteikarten ist, dass man überall lernen kann.", cat: "nomen" },
  { de: "der Nachteil, -e", pos: "名词", zh: "缺点", ex: "Der Nachteil ist, dass es viel Zeit kostet.", cat: "nomen" },
  { de: "die Möglichkeit, -en", pos: "名词", zh: "可能性；机会", ex: "Es gibt viele Möglichkeiten, Deutsch zu lernen.", cat: "nomen" },
  { de: "der Zusammenhang, \"-e", pos: "名词", zh: "关联；联系", ex: "Ich sehe keinen Zusammenhang zwischen den beiden Problemen.", cat: "nomen" },
  { de: "die Entscheidung, -en", pos: "名词", zh: "决定", ex: "Das war eine schwierige Entscheidung.", cat: "nomen" },
  { de: "die Prüfung, -en", pos: "名词", zh: "考试", ex: "Ich bereite mich auf die B1-Prüfung vor.", cat: "nomen" },
  { de: "die Aufgabe, -n", pos: "名词", zh: "任务；作业", ex: "Die Aufgabe war schwieriger als gedacht.", cat: "nomen" },

  { de: "sich bewerben (um + Akk.)", pos: "动词", zh: "申请", ex: "Ich bewerbe mich um einen Studienplatz.", cat: "verben" },
  { de: "teilnehmen (an + Dat.)", pos: "动词", zh: "参加", ex: "Ich nehme an einem Deutschkurs teil.", cat: "verben" },
  { de: "sich interessieren für", pos: "动词", zh: "对……感兴趣", ex: "Ich interessiere mich für deutsche Musik.", cat: "verben" },
  { de: "stattfinden", pos: "动词", zh: "举行；发生", ex: "Der Kurs findet am Montag statt.", cat: "verben" },
  { de: "verschieben", pos: "动词", zh: "推迟；挪动", ex: "Wir müssen den Termin verschieben.", cat: "verben" },
  { de: "sich entscheiden (für)", pos: "动词", zh: "决定；选择", ex: "Ich habe mich für den B1-Kurs entschieden.", cat: "verben" },
  { de: "zunehmen", pos: "动词", zh: "增加", ex: "Die Zahl der Studierenden nimmt zu.", cat: "verben" },
  { de: "erreichen", pos: "动词", zh: "达到；够到", ex: "Ich will das B1-Niveau erreichen.", cat: "verben" },
  { de: "sich vorbereiten (auf + Akk.)", pos: "动词", zh: "准备", ex: "Ich bereite mich auf die Prüfung vor.", cat: "verben" },
  { de: "empfehlen", pos: "动词", zh: "推荐", ex: "Kannst du mir ein Buch empfehlen?", cat: "verben" },
  { de: "üben", pos: "动词", zh: "练习", ex: "Ich übe jeden Tag eine Stunde.", cat: "verben" },

  { de: "zuverlässig", pos: "形容词", zh: "可靠的", ex: "Er ist ein zuverlässiger Kollege.", cat: "adjektive" },
  { de: "anstrengend", pos: "形容词", zh: "累人的；费力的", ex: "Der Tag war sehr anstrengend.", cat: "adjektive" },
  { de: "deutlich", pos: "形容词", zh: "清楚的；明确的", ex: "Sprich bitte deutlich.", cat: "adjektive" },
  { de: "geduldig", pos: "形容词", zh: "有耐心的", ex: "Man muss geduldig sein, wenn man eine Sprache lernt.", cat: "adjektive" },

  { de: "obwohl", pos: "连词", zh: "尽管（从句，动词到句末）", ex: "Obwohl es regnet, gehe ich joggen.", cat: "sonstiges" },
  { de: "deshalb", pos: "副词", zh: "因此", ex: "Ich habe früh angefangen, deshalb bin ich fertig.", cat: "sonstiges" },
  { de: "außerdem", pos: "副词", zh: "此外", ex: "Außerdem lese ich jeden Tag Nachrichten.", cat: "sonstiges" },
  { de: "trotzdem", pos: "副词", zh: "尽管如此", ex: "Es war spät, trotzdem bin ich noch gelaufen.", cat: "sonstiges" }
];

const tbody = document.querySelector("#vokabel-tbody");
const suche = document.querySelector("#suche");
const anzahl = document.querySelector("#anzahl");
const filterButtons = document.querySelectorAll("[data-filter]");

let aktiveKategorie = "alle";

// 用 DOM API 建表格（不用 innerHTML 拼字符串：写法更安全，也避免特殊字符出错）
function render() {
  const q = suche.value.trim().toLowerCase();
  const treffer = VOKABELN.filter(function (wort) {
    const passtKategorie = aktiveKategorie === "alle" || wort.cat === aktiveKategorie;
    const passtSuche = q === "" ||
      wort.de.toLowerCase().includes(q) ||
      wort.zh.toLowerCase().includes(q) ||
      wort.ex.toLowerCase().includes(q);
    return passtKategorie && passtSuche;
  });

  tbody.textContent = "";
  treffer.forEach(function (wort) {
    const tr = document.createElement("tr");
    [wort.de, wort.pos, wort.zh, wort.ex].forEach(function (text, index) {
      const zelle = document.createElement(index === 0 ? "th" : "td");
      if (index === 0) { zelle.setAttribute("scope", "row"); }
      zelle.textContent = text;
      if (index === 0) { zelle.classList.add("wort"); }
      if (index === 3) { zelle.classList.add("beispiel"); }
      tr.appendChild(zelle);
    });
    tbody.appendChild(tr);
  });

  anzahl.textContent = treffer.length + " 个词条" + (treffer.length === 0 ? " —— 试试别的关键词" : "");
}

suche.addEventListener("input", render);

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    aktiveKategorie = button.dataset.filter;
    filterButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === button));
      b.classList.toggle("aktiv", b === button);
    });
    render();
  });
});

render();
