/* ===========================================================
   中英文切换（i18n）
   -----------------------------------------------------------
   思路：
   1. HTML 里每个需要翻译的文字块都带 data-i18n="key"，原文是中文。
   2. 页面加载时把每个块的中文原文存进 Map（快照）。
   3. 切到英文：用词典里的英文覆盖；切回中文：从快照还原。
      → 只维护一份 HTML，不需要为英文再抄一套页面。
   4. 选择记在 localStorage；也支持 ?lang=en 直接进英文版（方便分享和测试）。
   5. 支持 data-i18n-placeholder / data-i18n-aria-label 翻译属性。

   为什么不用 innerHTML：翻译只改文字，不会重建元素结构，
   所以页面里原有的 <strong>、<a> 等标签不会被破坏。
   =========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "lang";
  var DEFAULT_LANG = "zh";

  /* ---------- 英文词典（中文原文在 HTML 里） ---------- */
  var TRANSLATIONS = {
    en: {
      /* 公共部分 */
      "site.title": "German A2 → B1 Self-Study Site",
      "nav.main": "Main navigation",
      "nav.home": "Home",
      "nav.methods": "Methods",
      "nav.vocab": "Vocabulary",
      "nav.contact": "Contact",
      "footer.text": "© 2026 Zhuoyang Chuai · This site is a Web Development course project; the content and the code are my own.",
      "lang.button": "中文",
      "lang.aria": "Switch to Chinese",

      /* 首页 */
      "page.index.title": "German A2→B1 Self-Study Site | One Student's Progress Log",
      "index.h1": "From A2 to B1 — and I'm writing the route down",
      "index.lead": "A classroom gives you grammar tables, not a weekly timetable. What's missing is never a textbook — it's what to do today.",
      "index.why.h2": "Why this site exists",
      "index.why.p1a": "I study computer science at Hainan Bielefeld University of Applied Sciences, with German as my minor. After A2, what actually blocked me wasn't a grammar point but three things: ",
      "index.why.p1b": "whether to add anything beyond the textbook, how to split one hour a day, and how to tell whether I was improving",
      "index.why.p1c": ".",
      "index.why.p2": "So I write the method down as I go. It is first an action list for myself, and only second a reference for people in a similar position: native Chinese speakers, busy with coursework, with only fragments of time.",
      "index.img.alt": "A curved path from A2 to B1 with four numbered milestones: vocabulary, listening, grammar, writing and speaking",
      "index.img.caption": "Four tracks move forward at the same time — you do not finish vocabulary before starting grammar.",
      "index.stand.table.aria": "Personal German learning progress",
      "index.woche.table.aria": "Weekly German study timetable",
      "index.stand.h2": "Where I started and where I am",
      "index.stand.caption": "Personal German learning progress (autumn 2026)",
      "index.stand.start": "Starting point",
      "index.stand.start.v": "A2 (German minor course at university)",
      "index.stand.now": "Now",
      "index.stand.now.v": "Pushing towards B1: I can read slow news and write an 80–120 word email (for example, replying to a German friend's Mid-Autumn greeting)",
      "index.stand.goal": "Goal",
      "index.stand.goal.s": "Pass the B1 exam and get the certificate first",
      "index.stand.goal.r": " — reading literature and handling internship interviews with it comes later",
      "index.stand.time": "Time per week",
      "index.stand.time.v": "One hour a day, about 7 hours a week — fixed slots, not “whenever I feel like it”",
      "index.inhalt.h2": "What's on this site",
      "index.inhalt.li1.rest": " — four tracks: vocabulary, listening, grammar, writing and speaking, each with concrete material and a weekly plan",
      "index.inhalt.li2": "Grammar list — the 8 points you have to fill in going from A2 to B1 (on the Methods page)",
      "index.inhalt.li3.rest": " — 31 high-frequency words, filterable by word class and searchable, each with an example sentence",
      "index.inhalt.li4.rest": " — a form with browser validation (this site has no backend, so nothing is actually sent)",
      "index.woche.h2": "How my week looks",
      "index.woche.caption": "Weekly German study timetable (one hour a day)",
      "index.woche.th1": "Day",
      "index.woche.th2": "What I do",
      "index.woche.th3": "Time",
      "index.woche.mon": "Mon",
      "index.woche.mon.task": "Vocabulary: 20 new words, learned inside sentences (no bare word lists)",
      "index.woche.tue": "Tue",
      "index.woche.tue.task": "Listening: one close listen of the textbook audio (listen → write → check transcript → read along)",
      "index.woche.wed": "Wed",
      "index.woche.wed.task": "Grammar: one point only, plus the matching workbook exercises",
      "index.woche.thu": "Thu",
      "index.woche.thu.task": "Writing: 100-word text on the textbook unit topic",
      "index.woche.fri": "Fri",
      "index.woche.fri.task": "Speaking: record a retelling of Tuesday's audio, then listen back for your own mistakes",
      "index.woche.sat": "Sat",
      "index.woche.sat.task": "Fix the weakest track — whichever one fell behind",
      "index.woche.sun": "Sun",
      "index.woche.sun.task": "Tidy the error notebook, review the week, pick next week's grammar point",
      "index.woche.min": "60 min",

      /* 学习方法页 */
      "page.methods.title": "Methods | German A2→B1 Self-Study Site",
      "methods.h1": "Methods: four tracks, a little of each every day",
      "methods.lead": "B1 isn't crammed — it's built by pushing four tracks slowly at the same time. Each one below says how to practise, with what material, and how much time per week.",
      "methods.material.h2": "I only use three kinds of material",
      "methods.material.li1.s": "Textbook",
      "methods.material.li1.r": " (the main line) — I follow the coursebook and the pace of my university German course, and don't start a parallel programme",
      "methods.material.li2.s": "Supplementary material",
      "methods.material.li2.r": " — workbook, dictionary app (for example sentences and conjugations), the audio that comes with the textbook",
      "methods.material.li3.s": "Things I make myself",
      "methods.material.li3.r": " — error notebook, flashcards, and every essay I write",
      "methods.material.p.s": "Rule: the textbook is the main line; supplementary material only solves problems the textbook cannot",
      "methods.material.p.r": ". I don't chase new apps — time spent switching material is time not spent practising.",

      "methods.wort.h2": "1. Vocabulary: only words stuck inside sentences stick",
      "methods.wort.p1a": "I no longer memorise word lists. A word counts as learned only once I have seen it inside a sentence — for example ",
      "methods.wort.p1s": "der Mondkuchen",
      "methods.wort.p1b": " (mooncake) stuck because I used it in a Mid-Autumn email to a German friend; copying it ten times would not have done that.",
      "methods.wort.li1.s": "How to practise",
      "methods.wort.li1.r": " — 20 words a day, each with a sentence I write myself; flashcards where the front is the sentence with a gap and the back is the word",
      "methods.wort.li2.s": "Topics first",
      "methods.wort.li2.r": " — work through high-frequency topic families (study, family, festivals, work, travel), not the alphabet",
      "methods.wort.li3.s": "Material",
      "methods.wort.li3.r": " — the textbook word list as the base, one flashcard app (I use Anki), a dictionary app for example sentences",

      "methods.hoeren.h2": "2. Listening: one close listen beats ten casual ones",
      "methods.hoeren.p1": "At A2 everyone gets stuck on where one word ends and the next begins. The fix is close listening: a one-minute clip, repeated until you can write down every word.",
      "methods.hoeren.li1": "First pass: listen only, get the gist, no pausing",
      "methods.hoeren.li2": "Second pass: pause sentence by sentence and write down what you hear (write even if it is incomplete)",
      "methods.hoeren.li3": "Compare with the transcript and mark what you misheard — usually small unstressed words like ich, auch, nicht, schon",
      "methods.hoeren.li4": "Finally read along three times, copying the rhythm and the pauses",
      "methods.hoeren.p2a": "Material: ",
      "methods.hoeren.p2s": "the audio that comes with the textbook",
      "methods.hoeren.p2b": " as the base (closest to exam speed); if I have energy left, I take slow news from the ",
      "methods.hoeren.p2link": "DW learning site",
      "methods.hoeren.p2c": " as a supplement.",

      "methods.gram.h2": "3. Grammar: the 8 points to fill in from A2 to B1",
      "methods.gram.p": "These eight are where I kept making mistakes. Attack one per week — don't be greedy.",
      "methods.gram.caption": "A2 → B1 key grammar list",
      "methods.gram.table.aria": "A2 to B1 key grammar list",
      "methods.gram.th1": "Grammar point",
      "methods.gram.th2": "German example",
      "methods.gram.th3": "What it means",
      "methods.gram.r1": "Past tense (Perfekt / Präteritum)",
      "methods.gram.r1.d": "Use Perfekt when speaking, Präteritum in written narrative",
      "methods.gram.r2": "Subjunctive (Konjunktiv II)",
      "methods.gram.r2.d": "For hypotheses and polite requests: Könnten Sie das wiederholen?",
      "methods.gram.r3": "Adjective endings",
      "methods.gram.r3.d": "Cannot be learned from a table — learn whole sentences",
      "methods.gram.r4": "Relative clauses",
      "methods.gram.r4.d": "The verb moves to the end of the clause",
      "methods.gram.r5": "Passive voice",
      "methods.gram.r5.d": "werden + past participle; all over technical texts",
      "methods.gram.r6": "Subordinating conjunctions",
      "methods.gram.r6.d": "After weil / obwohl / dass / wenn the verb goes to the end",
      "methods.gram.r7": "Separable verbs",
      "methods.gram.r7.d": "The prefix (an-) jumps to the end of the sentence — my most common A2 mistake",
      "methods.gram.r8": "Verb + fixed preposition",
      "methods.gram.r8.d": "Learn the verb and its preposition as one unit",

      "methods.schreiben.h2": "4. Writing and speaking: memorise the frame, swap the content",
      "methods.schreiben.p1": "B1 writing is not about style — it is about whether you can say the whole thing clearly. So I memorise sentence frames for common situations and only change the content:",
      "methods.schreiben.li1": "Opening / thanks: ",
      "methods.schreiben.li2": "Reacting: ",
      "methods.schreiben.li3": "Describing a custom: ",
      "methods.schreiben.li4": "Polite suggestion: ",
      "methods.schreiben.li5": "Closing: ",
      "methods.schreiben.p2": "For speaking I use the dumbest method that works: record yourself retelling something, then listen back. You immediately hear the mistakes you thought you had fixed.",
      "methods.fallen.h2": "Mistakes I have made",
      "methods.fallen.li1.s": "Memorising word lists only",
      "methods.fallen.li1.r": " — a month later I was back to zero, because the words never lived in a sentence",
      "methods.fallen.li2.s": "Spending ages choosing material",
      "methods.fallen.li2.r": " — I bookmarked DW, YouTube and three apps, then opened none of them. Fixing on one source was what got me moving",
      "methods.fallen.li3.s": "Trying to hear every word",
      "methods.fallen.li3.r": " — at B1 you are allowed to miss a few words; structure matters more than individual words",
      "methods.fallen.li4.s": "Doing grammar exercises without using the grammar",
      "methods.fallen.li4.r": " — I did 50 passive-voice exercises and then avoided the passive in my own writing. The rule that fixed it: every week's essay must use the grammar point I just learned",

      /* 词汇表页 */
      "page.vocab.title": "Vocabulary | German A2→B1 Self-Study Site",
      "vocab.h1": "Vocabulary: high-frequency words from A2 to B1",
      "vocab.lead": "These are not copied from a list — they are the words I kept getting wrong or could not produce in my own writing. Each has a full example sentence: isolated words don't stick, sentences do.",
      "vocab.search.h2": "Find a word",
      "vocab.search.label": "Search German, Chinese or the example sentence",
      "vocab.search.placeholder": "e.g. Entscheidung / 决定 / Prüfung",
      "vocab.group.aria": "Filter by word class",
      "vocab.filter.all": "All",
      "vocab.filter.nomen": "Nouns",
      "vocab.filter.verben": "Verbs",
      "vocab.filter.adjektive": "Adjectives",
      "vocab.filter.sonstiges": "Conjunctions / other",
      "vocab.list.h2": "Word list",
      "vocab.table.caption": "Word list: German entry, word class, meaning and example sentence",
      "vocab.table.aria": "Word list, scrolls horizontally on narrow screens",
      "vocab.th.german": "German",
      "vocab.th.pos": "Word class",
      "vocab.th.meaning": "Meaning",
      "vocab.th.example": "Example",
      "vocab.noscript": "The word list needs JavaScript to display and filter. Please enable JavaScript, or read the Methods page instead.",

      /* 联系页 */
      "page.contact.title": "Contact | German A2→B1 Self-Study Site",
      "contact.h1": "Contact me",
      "contact.lead": "I am building this site on my own. If you spot a typo, have a material suggestion, or you are also on the A2 to B1 road — you are welcome to write.",
      "contact.form.h2": "Write a message",
      "contact.name": "Your name",
      "contact.email": "Email",
      "contact.subject": "Subject",
      "contact.message": "Message",
      "contact.opt0": "Please choose…",
      "contact.opt1": "An error in the vocabulary list",
      "contact.opt2": "Methods / material suggestion",
      "contact.opt3": "A problem with the site",
      "contact.opt4": "Something else",
      "contact.message.hint": "At least 10 characters. Please do not include ID numbers, addresses or other private data.",
      "contact.submit": "Send",
      "contact.note": "Note: this is a course project with no backend server. The form validates in the browser and shows a confirmation only — it does not actually send an email. That is a deliberate design trade-off, not a defect."
    }
  };

  /* 页面加载时记下的中文原文（快照） */
  var textOriginals = new Map();
  var attrOriginals = new Map();
  var currentLang = DEFAULT_LANG;

  /* ---------- 工具 ---------- */

  // 给 JS 生成的内容用：t("key", {name: "..."}) 取词典；没有对应语言就返回 fallback
  function t(key, params) {
    var dict = TRANSLATIONS[currentLang];
    var value = dict && dict[key] !== undefined ? dict[key] : null;
    if (value === null) {
      return "";
    }
    if (params) {
      Object.keys(params).forEach(function (name) {
        value = value.replace("{" + name + "}", params[name]);
      });
    }
    return value;
  }

  function snapshot() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!textOriginals.has(el)) {
        textOriginals.set(el, el.textContent);
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var store = attrOriginals.get(el) || {};
      if (store.placeholder === undefined) {
        store.placeholder = el.getAttribute("placeholder") || "";
        attrOriginals.set(el, store);
      }
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var store = attrOriginals.get(el) || {};
      if (store.ariaLabel === undefined) {
        store.ariaLabel = el.getAttribute("aria-label") || "";
        attrOriginals.set(el, store);
      }
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var store = attrOriginals.get(el) || {};
      if (store.alt === undefined) {
        store.alt = el.getAttribute("alt") || "";
        attrOriginals.set(el, store);
      }
    });
  }

  function applyText(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (lang !== DEFAULT_LANG && translated !== undefined) {
        el.textContent = translated;
      } else {
        el.textContent = textOriginals.get(el) || el.textContent;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      var store = attrOriginals.get(el) || {};
      el.setAttribute("placeholder", translated !== undefined && lang !== DEFAULT_LANG ? translated : (store.placeholder || ""));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      var translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      var store = attrOriginals.get(el) || {};
      el.setAttribute("aria-label", translated !== undefined && lang !== DEFAULT_LANG ? translated : (store.ariaLabel || ""));
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      var store = attrOriginals.get(el) || {};
      el.setAttribute("alt", translated !== undefined && lang !== DEFAULT_LANG ? translated : (store.alt || ""));
    });
  }

  function apply(lang) {
    currentLang = lang === "en" ? "en" : DEFAULT_LANG;
    document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
    applyText(currentLang);
    try {
      localStorage.setItem(STORAGE_KEY, currentLang);
    } catch (e) {
      /* 隐私模式下 localStorage 可能不可用，忽略即可 */
    }
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: currentLang } }));
  }

  function initialLang() {
    // 优先级：网址参数 ?lang= > 上次的选择 > 默认中文
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "en" || fromUrl === "zh") {
      return fromUrl;
    }
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "zh") {
        return saved;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_LANG;
  }

  function setupToggle() {
    var button = document.querySelector("#lang-toggle");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      apply(currentLang === "en" ? "zh" : "en");
    });
  }

  function init() {
    snapshot();
    setupToggle();
    var lang = initialLang();
    if (lang !== DEFAULT_LANG) {
      apply(lang);
    } else {
      currentLang = DEFAULT_LANG;           // 中文就是原文，不用改
      document.documentElement.lang = "zh-CN";
    }
  }

  // 暴露给其他脚本（vokabeln.js / kontakt.js 生成文字时要用）
  window.i18n = {
    t: t,
    apply: apply,
    get lang() { return currentLang; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
