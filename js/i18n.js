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
      "page.vocab.title": "Vocabulary | Deutsch-Lernzimmer",
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
      "page.notes.title": "Class notes | Deutsch-Lernzimmer",
      "notes.h1": "Class notes",
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
      "page.404.title": "Page not found (404) | Deutsch-Lernzimmer",
      "error.h1": "This page has wandered off",
      "error.p": "The address may be mistyped, or I have moved this page. The links below still work.",
      "error.home": "Back to the home page",
      "error.vocab": "Go to the vocabulary",

      /* 联系页 */
      "page.contact.title": "Contact | Deutsch-Lernzimmer",
      "contact.h1": "Contact & feedback",
      "contact.lead": "This site is open: spot a typo, have material to recommend, think a grammar point is missing, or are you also on the A2 to B1 road? Write to me. (No backend — the form validates locally and is not actually sent; copy the text and send it to me on WeChat or by email.)",
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
      "index.lead": "Everything here is free to take: 703 high-frequency words, a 60-minute-a-day weekly plan, and the 8 grammar points you must fix between A2 and B1. If something is missing or wrong, you can add it yourself.",
      "index.cta.word": "Start 10 questions",
      "index.cta.join": "I want to contribute",
      "index.honest": "Straight up: there is no backend. “Signing in”, your progress, the words and suggestions you submit are stored only in this browser (localStorage) and are never uploaded. So this is curated content plus your own study space — not a social network.",
      "index.three.h2": "Three things to do today",
      "index.three.t1": "Draw 10 words",
      "index.three.d1": "No choosing: one question after another. A wrong answer shows the correct one plus an example sentence.",
      "index.three.a1": "Go to the challenge",
      "index.three.t2": "Look up a word",
      "index.three.d2": "703 words, searchable, filterable by part of speech or topic, each with a full example sentence.",
      "index.three.a2": "Search the list",
      "index.three.t3": "Copy a weekly plan",
      "index.three.d3": "One task a day, Monday to Sunday, 60 minutes each. Just copy it.",
      "index.three.a3": "Open the index",
      "index.have.h2": "What is already here",
      "index.have.t1": "Knowledge index",
      "index.have.d1": "8 must-fix grammar points, four skill lines, what materials to use, mistakes to avoid — 20 entries, searchable and filterable.",
      "index.have.a1": "Have a look",
      "index.have.t2": "Vocabulary",
      "index.have.d2": "703 words with part of speech, meaning and example, filterable by word class and topic.",
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
      "challenge.scope.all": "All 703 words",
      "challenge.scope.b1": "B1 vocabulary (596)",
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
      "challenge.hint": "Keyboard works too: 1–4 to answer, Enter for the next question.",

      /* ---------- 知识索引 20 条正文（W4 补：整块 HTML 翻译） ---------- */
      "wissen.e01.title": "Past tense: Perfekt / Präteritum",
      "wissen.e01.sum": "Perfekt for speech, Präteritum for writing",
      "wissen.e01.body": "<p><span class=\"de\">Perfekt</span> is what people actually say: <span class=\"de\">Ich habe gestern einen Film gesehen.</span></p><p>Written narration (news, stories) uses <span class=\"de\">Präteritum</span>: <span class=\"de\">Ich sah gestern einen Film.</span></p><p>Learn the past forms of <span class=\"de\">haben / sein</span> too: <span class=\"de\">ich war</span>, <span class=\"de\">ich hatte</span>.</p>",
      "wissen.e01.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e02.title": "Subjunctive: Konjunktiv II",
      "wissen.e02.sum": "For hypotheticals and polite requests",
      "wissen.e02.body": "<p>Hypothetical: <span class=\"de\">Wenn ich Zeit hätte, würde ich mehr lesen.</span></p><p>Polite request: <span class=\"de\">Könnten Sie das wiederholen?</span></p><p>The three you need most: <span class=\"de\">hätte / wäre / würde</span>.</p>",
      "wissen.e02.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e03.title": "Adjective endings",
      "wissen.e03.sum": "Tables won't stick — memorise whole phrases",
      "wissen.e03.body": "<p><span class=\"de\">ein wichtiges Familienfest</span> (an important family festival)</p><p>There are three sets of endings: after the definite article, after the indefinite article, and with no article. Do not memorise the grid — memorise a phrase and swap the noun.</p>",
      "wissen.e03.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e04.title": "Relative clauses (Relativsatz)",
      "wissen.e04.sum": "The verb goes to the end of the clause",
      "wissen.e04.body": "<p><span class=\"de\">Das ist der Kurs, den ich besuche.</span></p><p>The relative pronoun takes the case it has inside the clause: <span class=\"de\">den</span> (masculine, accusative). The conjugated verb sits at the end of the clause.</p>",
      "wissen.e04.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e05.title": "Passive (Passiv)",
      "wissen.e05.sum": "werden + past participle — rife in technical texts",
      "wissen.e05.body": "<p><span class=\"de\">Die Hausaufgabe wird morgen korrigiert.</span> (the homework will be marked tomorrow)</p><p>Pattern: conjugated <span class=\"de\">werden</span> + past participle at the end. With a modal it becomes <span class=\"de\">muss … korrigiert werden</span>.</p>",
      "wissen.e05.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e06.title": "Subordinating conjunctions weil / obwohl / dass / wenn",
      "wissen.e06.sum": "These conjunctions push the verb to the end",
      "wissen.e06.body": "<p><span class=\"de\">Ich lerne Deutsch, weil ich in Deutschland studieren will.</span></p><p>As soon as one of these conjunctions appears, the conjugated verb is kicked to the end (<span class=\"de\">will</span> comes last).</p>",
      "wissen.e06.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e07.title": "Separable verbs",
      "wissen.e07.sum": "The prefix jumps to the end — the classic A2 mistake",
      "wissen.e07.body": "<p><span class=\"de\">Ich fange um acht an.</span> (anfangen splits)</p><p>With prefixes like <span class=\"de\">an- / auf- / ein- / mit- / zu-</span>, the prefix moves to the end of the main clause; with a modal verb or inside a subordinate clause it stays attached: <span class=\"de\">Ich will um acht anfangen.</span></p>",
      "wissen.e07.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e08.title": "Prepositions that verbs demand",
      "wissen.e08.sum": "Verb + fixed preposition: learn them as one unit",
      "wissen.e08.body": "<p><span class=\"de\">Ich warte auf den Bus.</span> (waiting for the bus)</p><p><span class=\"de\">Ich interessiere mich für Musik.</span> (interested in music)</p><p>The preposition and the case it governs are fixed. Learning the verb alone is useless — learn verb + preposition + case together.</p>",
      "wissen.e08.links": "<a href=\"vokabeln.html\">Find related words in the vocabulary list</a>",
      "wissen.e09.title": "Words stick when they live in a sentence",
      "wissen.e09.sum": "A word only counts once you have met it in context",
      "wissen.e09.body": "<ul><li><b>How</b>: 20 words a day, each with one sentence you wrote yourself</li><li><b>Flashcards</b>: a sentence with a gap on the front, the word on the back — you have to recall it from context</li><li><b>Material</b>: the textbook word list, a flashcard app, and a dictionary app for examples</li></ul><p>The anti-pattern: copying a word list ten times. A month later you are back where you started, because the words never entered a sentence.</p>",
      "wissen.e09.links": "<a href=\"challenge.html\">Practise in the word challenge</a>",
      "wissen.e10.title": "Topics first, not the alphabet",
      "wissen.e10.sum": "Start with high-frequency topic clusters, then spread out",
      "wissen.e10.body": "<p>Start with the topics that keep coming up — study, family, festivals, work, travel — instead of grinding from A to Z.</p><p>The vocabulary here is already grouped by topic: weather, city &amp; life, future &amp; plans, business &amp; ideas, B1 high-frequency, everyday &amp; study.</p>",
      "wissen.e10.links": "<a href=\"vokabeln.html\">Browse the vocabulary by topic</a>",
      "wissen.e11.title": "Intensive listening in four steps",
      "wissen.e11.sum": "A2 learners can't hear where one word ends and the next begins",
      "wissen.e11.body": "<ol><li>Pass 1: listen only, grab the gist, no pausing</li><li>Pass 2: pause sentence by sentence and write down what you hear — even if it is incomplete</li><li>Check against the transcript and mark what you misheard (usually unstressed small words: ich / auch / nicht / schon)</li><li>Finally read along three times, copying the intonation and pauses</li></ol>",
      "wissen.e12.title": "Choosing listening material",
      "wissen.e12.sum": "Textbook audio first; slow news only if you have spare time",
      "wissen.e12.body": "<p>Main source: <b>the audio that comes with your textbook</b> — closest to the exam speed.</p><p>Extra: slow news from <a href=\"https://learngerman.dw.com/\" rel=\"noopener\">Deutsche Welle (DW) Learn German</a>.</p><p>Use one. Do not run five sources at once.</p>",
      "wissen.e13.title": "Writing: reuse a skeleton, swap the content",
      "wissen.e13.sum": "B1 writing tests completeness and clarity, not style",
      "wissen.e13.body": "<ul><li>Opening thanks: <span class=\"de\">vielen Dank für deine E-Mail / die Einladung!</span></li><li>Feelings: <span class=\"de\">Ich freue mich sehr darüber.</span></li><li>Describing a custom: <span class=\"de\">Bei uns ist … ein wichtiges Familienfest.</span></li><li>Polite suggestion: <span class=\"de\">Wir könnten uns in … treffen. / Wie wäre es mit …?</span></li><li>Sign-off: <span class=\"de\">Viele Grüße / Bis bald!</span></li></ul>",
      "wissen.e14.title": "Speaking: record yourself retelling",
      "wissen.e14.sum": "Playback exposes the mistakes you thought you had fixed",
      "wissen.e14.body": "<p>The dumbest method that works: retell what you just listened to, record it, then play it back.</p><p>You will immediately hear the things you were sure were right — endings and prepositions above all.</p>",
      "wissen.e15.title": "Only three kinds of material",
      "wissen.e15.sum": "The textbook leads; extras only fill its gaps",
      "wissen.e15.body": "<ul><li><b>Textbook</b> (the backbone): follow the course book and the class pace, do not start a parallel track</li><li><b>Support</b>: workbook, dictionary app (examples and conjugations), the textbook audio</li><li><b>What you make</b>: error log, flashcards, the essay you finish each week</li></ul><p>Rule: stop chasing new apps — the time you spend switching material is a rep you did not do.</p>",
      "wissen.e16.title": "How to spread 60 minutes across a week",
      "wissen.e16.sum": "One task per day, Monday to Sunday — just copy it",
      "wissen.e16.body": "<ul><li>Mon — vocabulary: 20 new words, each inside a sentence</li><li>Tue — listening: one intensive pass: listen → write → check → read along</li><li>Wed — grammar: one single point, plus the matching workbook exercises</li><li>Thu — writing: 100 words on the current textbook unit</li><li>Fri — speaking: record yourself retelling Tuesday's audio</li><li>Sat — patch the weakest line: whatever fell behind</li><li>Sun — tidy the error log, review the week, pick next week's grammar point</li></ul>",
      "wissen.e17.title": "Memorising word lists only",
      "wissen.e17.sum": "A month later you are back at square one, because the words never entered a sentence",
      "wissen.e17.body": "<p>A month later you are back at square one, because the words never entered a sentence</p>",
      "wissen.e18.title": "Shopping for material for weeks",
      "wissen.e18.sum": "DW, YouTube, three apps — all bookmarked, none opened. It only moved once I fixed on exactly one",
      "wissen.e18.body": "<p>DW, YouTube, three apps — all bookmarked, none opened. It only moved once I fixed on exactly one</p>",
      "wissen.e19.title": "Trying to catch every single word",
      "wissen.e19.sum": "B1 listening lets you miss a few words; structure matters more than word-by-word coverage",
      "wissen.e19.body": "<p>B1 listening lets you miss a few words; structure matters more than word-by-word coverage</p>",
      "wissen.e20.title": "Doing grammar drills without using them",
      "wissen.e20.sum": "Fifty passive-voice exercises, zero uses in writing. It only stuck once every weekly essay had to use the new point",
      "wissen.e20.body": "<p>Fifty passive-voice exercises, zero uses in writing. It only stuck once every weekly essay had to use the new point</p>"
    }
  };

  /* 页面加载时记下的中文原文（快照） */
  var textOriginals = new Map();
  var attrOriginals = new Map();
  var htmlOriginals = new Map();   /* data-i18n-html 用：整块 HTML 的原文快照 */
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
    /* 整块带标签的内容（比如条目正文）单独记 innerHTML */
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (!htmlOriginals.has(el)) {
        htmlOriginals.set(el, el.innerHTML);
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

    /* 整块 HTML 的翻译：data-i18n-html
       为什么不用 textContent：条目正文里有 <ul>/<li>/<span class="de">，
       用 textContent 会把标签一起吃掉。所以这一种单独走 innerHTML。
       切回中文时从 htmlOriginals 还原，跟文字那套逻辑一致。 */
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
      if (lang !== DEFAULT_LANG && translated !== undefined) {
        el.innerHTML = translated;
      } else if (htmlOriginals.has(el)) {
        el.innerHTML = htmlOriginals.get(el);
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
