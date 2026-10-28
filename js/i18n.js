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
      "site.title": "Deutsch-Lernzimmer · German Study Room",
      "nav.main": "Main navigation",
      "nav.home": "Home",
      "nav.vocab": "Vocabulary",
      "nav.contact": "Contact",
      "nav.notes": "Notes",
      "footer.text": "© 2026 Zhuoyang Chuai · This site is a Web Development course project; the content and the code are my own.",
      "lang.button": "中文",
      "lang.aria": "Switch to Chinese",

      /* 首页 */
      "page.index.title": "Deutsch-Lernzimmer | An open German A2→B1 study site",
      "index.img.alt": "A curved path from A2 to B1 with four numbered milestones: vocabulary, listening, grammar, writing and speaking",






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
      "vocab.filter.class": "By word class",
      "vocab.filter.topic": "By topic",
      "vocab.group.thema": "Filter by topic",
      "vocab.thema.all": "All topics",
      "vocab.thema.b1": "B1 high-frequency",
      "vocab.thema.alltag": "Everyday & study",
      "vocab.thema.business": "Business & ideas",
      "vocab.thema.wetter": "Weather",
      "vocab.thema.stadt": "City & living",
      "vocab.thema.zukunft": "Future & plans",
      "vocab.list.h2": "Word list",
      "vocab.table.caption": "Word list: German entry, word class, meaning and example sentence",
      "vocab.table.aria": "Word list, scrolls horizontally on narrow screens",
      "vocab.th.german": "German",
      "vocab.th.pos": "Word class",
      "vocab.th.meaning": "Meaning",
      "vocab.th.example": "Example",
      "vocab.noscript": "The word list needs JavaScript to display and filter. Please enable JavaScript, or read the Methods page instead.",

      /* 笔记页 */
      "page.notes.title": "My notes | German A2→B1 Self-Study Site",
      "notes.h1": "My notes",
      "notes.lead": "This page comes from my class notebook and my dictation exercise book — written by me, word by word (the originals are paper photos). I retyped it here. I don't publish textbook photos: that content belongs to the publisher.",
      "notes.diktat.h2": "Dictation: Diktat 7 “Meine Freundinnen”",
      "notes.diktat.p": "How it works: the teacher reads, I write; afterwards I compare with the original and correct in red pen. Below is the correct version I ended up with.",
      "notes.diktat.h3": "Three problems this dictation exposed",
      "notes.diktat.li1": "Numbers I mishear: vier and viel sound almost identical — get the meaning of the sentence first, then write the number.",
      "notes.diktat.li2": "Word order: Am Wochenende sind wir … / Manchmal gehen wir … — when an adverbial starts the sentence, the verb stays in second position and the subject moves behind it.",
      "notes.diktat.li3": "Third-person verbs: liest, sieht, spielt — I keep dropping the final -t.",
      "notes.diktat.p2": "Conclusion: a dictation doesn't test how many words you know, it tests where you leak.",
      "notes.quelle.h2": "Where the vocabulary comes from (Lernwortschatz pages 5–6)",
      "notes.quelle.p": "I sorted two pages of coursebook vocabulary by topic into the vocabulary page — 107 words in total, 76 of them from those two pages. The Chinese glosses are my own, so a few differ from a dictionary (for example I wrote anonym as “无名的”).",
      "notes.quelle.li1": "Everyday & study (31 words, my own earlier list)",
      "notes.quelle.li2": "Business & ideas (10 words, Lernwortschatz 5)",
      "notes.quelle.li3": "Weather (11 words, Lernwortschatz 5)",
      "notes.quelle.li4": "City & living (31 words, Lernwortschatz 6)",
      "notes.quelle.li5": "Future & plans (24 words, Lernwortschatz 6)",
      "notes.quelle.p2": "Why by topic and not alphabetically: when I speak or write, I look for words by situation, not by the alphabet.",
      "notes.nutzung.h2": "How I actually use these notes",
      "notes.nutzung.li1": "A full word list is useless on its own — I keep only the ones I get wrong and cross out the rest.",
      "notes.nutzung.li2": "With dictation I write down the type of mistake (numbers, word order, verb endings), not individual words.",
      "notes.nutzung.li3": "Every Sunday: which type of mistake came back this week?",

      /* 404 页 */
      "page.404.title": "Page not found (404) | German A2→B1 Self-Study Site",
      "error.h1": "This page has wandered off",
      "error.p": "The address may be mistyped, or I have moved this page. The links below still work.",
      "error.home": "Back to the home page",
      "error.vocab": "Go to the vocabulary",

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
      "contact.note": "Note: this is a course project with no backend server. The form validates in the browser and shows a confirmation only — it does not actually send an email. That is a deliberate design trade-off, not a defect.",

      /* ---------- W4 新增：首页改版 / 知识索引 / 单词挑战 ---------- */
      /* nav（W4 新增） */
      "nav.index": "Knowledge index",
      "nav.challenge": "Word challenge",

      /* page（W4 新增） */
      "page.wissen.title": "Knowledge index | Deutsch-Lernzimmer",
      "page.challenge.title": "Word challenge | Deutsch-Lernzimmer",

      /* index（W4 新增） */
      "index.kicker": "An open German study site · A2 → B1",
      "index.h1": "A2 to B1 shouldn't be a solo grind",
      "index.lead": "Everything here is free to take: 203 high-frequency words, a 60-minute-a-day weekly plan, and the 8 grammar points you must fix between A2 and B1. If something is missing or wrong, you can add it yourself.",
      "index.cta.word": "Start 10 questions",
      "index.cta.join": "I want to contribute",
      "index.honest": "Straight up: there is no backend. “Signing in”, your progress, the words and suggestions you submit are stored only in this browser (localStorage) and are never uploaded. So this is curated content plus your own study space — not a social network.",
      "index.three.h2": "Three things to do today",
      "index.three.t1": "Draw 10 words",
      "index.three.d1": "No choosing: one question after another. A wrong answer shows the correct one plus an example sentence.",
      "index.three.a1": "Go to the challenge",
      "index.three.t2": "Look up a word",
      "index.three.d2": "203 words, searchable, filterable by part of speech or topic, each with a full example sentence.",
      "index.three.a2": "Search the list",
      "index.three.t3": "Copy a weekly plan",
      "index.three.d3": "One task a day, Monday to Sunday, 60 minutes each. Just copy it.",
      "index.three.a3": "Open the index",
      "index.have.h2": "What is already here",
      "index.have.t1": "Knowledge index",
      "index.have.d1": "8 must-fix grammar points, four skill lines, what materials to use, mistakes to avoid — 20 entries, searchable and filterable.",
      "index.have.a1": "Have a look",
      "index.have.t2": "Vocabulary",
      "index.have.d2": "203 words with part of speech, meaning and example, filterable by word class and topic.",
      "index.have.a2": "Search the list",
      "index.have.t3": "Class notes",
      "index.have.d3": "Topic word groups sorted from textbook and dictation notes: weather, city, jobs, future plans, business ideas.",
      "index.have.a3": "Read the notes",
      "index.word.h2": "Five words for today",
      "index.word.hint": "Tap a card to flip it and see the example; tap “learned” to record progress (stored locally).",
      "index.word.reroll": "Shuffle",
      "index.prog.label": "Your name (local only)",
      "index.prog.save": "Save",
      "index.prog.a": "My progress: learned",
      "index.prog.b": "words",
      "index.prog.hint": "No name is fine — progress is still recorded.",
      "index.join.h2": "You can add things here too",
      "index.join.lead": "A missing word, a design complaint, a grammar point that should be covered — write it below.",
      "index.form.word.h3": "Submit a word",
      "index.form.word.sub": "German word + Chinese meaning + one example sentence; it appears in the list below.",
      "index.form.de": "German",
      "index.form.zh": "Chinese",
      "index.form.ex": "Example (optional)",
      "index.form.submit": "Add it",
      "index.form.idea.h3": "Leave a suggestion",
      "index.form.idea.sub": "Too cluttered? Want a feature? Write it down.",
      "index.form.idea.label": "Your idea",
      "index.form.save": "Save it",
      "index.form.copy": "Copy as text and send it to me",
      "index.step.h2": "How to take part",
      "index.step.1b": "Use",
      "index.step.1r": " — word list, index, weekly plan: no sign-up, just copy.",
      "index.step.2b": "Add",
      "index.step.2r": " — words in your textbook that are missing here: submit them. Errors too.",
      "index.step.3b": "Pass it on",
      "index.step.3r": " — if this helps, send the link to a classmate so they skip a stretch of the road.",
      "index.gal.h2": "Images, readable",
      "index.gal.lead": "Tap any image to enlarge (plain HTML, CSS and a little JS — no plugins).",
      "index.gal.cap1": "Learning path: four lines at once, not one after another",
      "index.gal.cap2": "Word cards: draw at random, flip for an example",
      "index.gal.cap3": "Weekly plan: one task a day",
      "index.gal.alt1": "A path from A2 to B1 with four numbered milestones",
      "index.gal.alt2": "Three stacked German word cards showing die Geduld",
      "index.gal.alt3": "A bar chart of the seven-day week with Saturday marked as buffer",
      "index.gal.aria": "Enlarge image",
      "index.gal.close": "Close",

      /* wissen（W4 新增） */
      "wissen.h1": "Knowledge index",
      "wissen.lead": "Everything on this site, sorted: the 8 must-fix grammar points, how to train the four skill lines, what materials to use, and the mistakes to avoid. Search a keyword or pick a category.",
      "wissen.search.label": "Search",
      "wissen.search.placeholder": "e.g. passive, intensive listening, separable verb, prepositions, Perfekt",
      "wissen.search.kbd1": "press",
      "wissen.search.kbd2": "to jump here",
      "wissen.chips.aria": "Filter by category",
      "wissen.cat.all": "All",
      "wissen.cat.gram": "Grammar",
      "wissen.cat.wort": "Vocabulary",
      "wissen.cat.hoer": "Listening",
      "wissen.cat.prod": "Writing & speaking",
      "wissen.cat.mat": "Materials & schedule",
      "wissen.cat.falle": "Pitfalls",
      "wissen.show": "Showing",
      "wissen.items": "entries",
      "wissen.empty": "No matching entry. Try another keyword, or pick All.",

      /* challenge（W4 新增） */
      "challenge.h1": "Word challenge",
      "challenge.lead": "10 questions per round, four options each. A wrong answer immediately shows the correct one with its example sentence. Scores are stored in this browser only.",
      "challenge.mode.label": "What to test",
      "challenge.mode.deZh": "German → Chinese",
      "challenge.mode.zhDe": "Chinese → German",
      "challenge.scope.label": "Which words",
      "challenge.scope.all": "All 203 words",
      "challenge.scope.b1": "B1 high-frequency only (96)",
      "challenge.scope.notiz": "Textbook & notes only (107)",
      "challenge.len.label": "Length",
      "challenge.len.ten": "10 questions",
      "challenge.len.twenty": "20 questions",
      "challenge.stat.qno": "Q",
      "challenge.stat.ok": "Correct",
      "challenge.stat.streak": "Streak",
      "challenge.btn.restart": "Restart",
      "challenge.btn.again": "Play again",
      "challenge.btn.back": "Back to questions",
      "challenge.hint": "Keyboard works too: 1–4 to answer, Enter for the next question."
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
