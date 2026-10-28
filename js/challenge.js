/* ===========================================================
   单词挑战：出题 + 判分
   -----------------------------------------------------------
   数据从哪来：js/vokabeln-data*.js 里那三个数组
     VOKABELN（课本与笔记 107）+ VOKABELN_B1（50）+ VOKABELN_B1_2（46）
   —— 和词汇表页共用同一份数据，加词只改数据文件，这页不用动。

   出题逻辑（能讲的部分）：
   1. 先按范围筛出一个池子，再从池子里随机抽 N 个词。
   2. 每题生成 4 个选项：正确答案 + 3 个干扰项。
   3. 干扰项优先取"同词性"的词 —— 考名词不该配一个"很快"当干扰项，
      否则一眼就能猜出来。同词性不够才用其它词性补。
   4. 选项文本去重（中文释义有可能重复）。
   5. 答对答错都只是 Class 切换，不重建整块 DOM。
   =========================================================== */

(function () {
  'use strict';

  var ALL = VOKABELN.concat(VOKABELN_B1, VOKABELN_B1_2);
  var K_BEST = 'dz_best';

  /* 反馈用的小词典：跟着 <html lang> 走（i18n.js 会改它） */
  var T = {
    zh: {
      qDeZh: '这个德语词是什么意思？',
      qZhDe: '这个词的德语怎么说？',
      next: '下一题',
      last: '看成绩',
      restart: '重新开始',
      again: '再来一轮',
      back: '回到题目',
      right: '✓ 对了',
      streak: '（连击 ',
      streakEnd: '！）',
      wrong: '✕ 正确答案：',
      perfect: '满分，这轮没有错词',
      good: '这轮不错',
      poor: '错的有点多，回去再背一遍',
      rate: '正确率 ',
      best: ' · 本次最高 ',
      best2: ' 题',
      prev: '（上次最好 ',
      prevEnd: '）',
      wrongHead: '错题回顾',
      noWrong: '没有错题 🎉'
    },
    en: {
      qDeZh: 'What does this German word mean?',
      qZhDe: 'How do you say this in German?',
      next: 'Next',
      last: 'See result',
      restart: 'Restart',
      again: 'Play again',
      back: 'Back to questions',
      right: '✓ Correct',
      streak: ' (streak ',
      streakEnd: '!)',
      wrong: '✕ Correct answer: ',
      perfect: 'Perfect — no mistakes',
      good: 'Solid round',
      poor: 'A few too many mistakes — review and retry',
      rate: 'Accuracy ',
      best: ' · best this round ',
      best2: '',
      prev: ' (previous best ',
      prevEnd: ')',
      wrongHead: 'What you missed',
      noWrong: 'No mistakes 🎉'
    }
  };

  function t(key) {
    var l = (document.documentElement.lang === 'en') ? 'en' : 'zh';
    return T[l][key];
  }

  var el = {
    mode: document.getElementById('mode'),
    scope: document.getElementById('scope'),
    len: document.getElementById('len'),
    qNo: document.getElementById('qNo'),
    qTot: document.getElementById('qTot'),
    okCount: document.getElementById('okCount'),
    streak: document.getElementById('streak'),
    qLabel: document.getElementById('qLabel'),
    qWord: document.getElementById('qWord'),
    qSub: document.getElementById('qSub'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    nextBtn: document.getElementById('nextBtn'),
    card: document.getElementById('quizCard'),
    result: document.getElementById('result'),
    resTitle: document.getElementById('resTitle'),
    resScore: document.getElementById('resScore'),
    resTotal: document.getElementById('resTotal'),
    resMeta: document.getElementById('resMeta'),
    wrongHead: document.getElementById('wrongHead'),
    wrongList: document.getElementById('wrongList')
  };

  var state = { deck: [], idx: 0, ok: 0, streak: 0, wrong: [], answered: false };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pool() {
    var s = el.scope.value;
    if (s === 'b1') return ALL.filter(function (w) { return w.thema === 'b1'; });
    if (s === 'notiz') return ALL.filter(function (w) { return w.thema !== 'b1'; });
    return ALL.slice();
  }

  function makeOptions(word, list, mode) {
    var key = (mode === 'de-zh') ? 'zh' : 'de';
    var used = {};
    used[word[key]] = 1;
    var same = shuffle(list.filter(function (w) {
      return w.pos === word.pos && w[key] !== word[key];
    }));
    var others = shuffle(list.filter(function (w) {
      return w.pos !== word.pos && w[key] !== word[key];
    }));
    var picks = [];
    var src = same.concat(others);
    for (var i = 0; i < src.length && picks.length < 3; i++) {
      if (used[src[i][key]]) continue;
      used[src[i][key]] = 1;
      picks.push(src[i][key]);
    }
    return shuffle([word[key]].concat(picks));
  }

  function buildDeck() {
    var list = pool();
    var want = parseInt(el.len.value, 10) || 10;
    var n = Math.min(want, list.length);
    var picked = shuffle(list.slice()).slice(0, n);
    var mode = el.mode.value;

    state.deck = picked.map(function (w) {
      return { w: w, options: makeOptions(w, list, mode) };
    });
    state.idx = 0; state.ok = 0; state.streak = 0; state.wrong = []; state.answered = false;

    el.card.hidden = false;
    el.result.hidden = true;
    el.qTot.textContent = state.deck.length;
    render();
  }

  function render() {
    var q = state.deck[state.idx];
    var w = q.w;
    var deZh = el.mode.value === 'de-zh';

    el.qNo.textContent = state.idx + 1;
    el.okCount.textContent = state.ok;
    el.streak.textContent = state.streak;
    el.qLabel.textContent = deZh ? t('qDeZh') : t('qZhDe');
    el.qWord.textContent = deZh ? w.de : w.zh;
    el.qSub.textContent = deZh ? (w.pos || '') : '';
    el.feedback.textContent = '';
    el.feedback.className = 'feedback';
    el.nextBtn.disabled = true;
    el.nextBtn.textContent = (state.idx === state.deck.length - 1) ? t('last') : t('next');
    el.options.innerHTML = '';

    q.options.forEach(function (text, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = i + 1;
      var label = document.createElement('span');
      label.textContent = text;
      b.appendChild(num);
      b.appendChild(label);
      b.addEventListener('click', function () { answer(b, text); });
      el.options.appendChild(b);
    });

    state.answered = false;
  }

  function answer(btn, text) {
    if (state.answered) return;
    state.answered = true;

    var q = state.deck[state.idx];
    var w = q.w;
    var deZh = el.mode.value === 'de-zh';
    var correctText = deZh ? w.zh : w.de;
    var right = (text === correctText);

    Array.prototype.forEach.call(el.options.querySelectorAll('.opt'), function (b) {
      b.disabled = true;
      var label = b.lastElementChild.textContent;
      if (label === correctText) b.classList.add('is-correct');
      else if (label === text) b.classList.add('is-wrong');
      else b.classList.add('is-dim');
    });

    if (right) {
      state.ok++; state.streak++;
      el.feedback.className = 'feedback ok';
      el.feedback.textContent = t('right') +
        (state.streak >= 3 ? t('streak') + state.streak + t('streakEnd') : '');
      var exOk = document.createElement('span');
      exOk.className = 'ex';
      exOk.textContent = w.ex || '';
      el.feedback.appendChild(exOk);
    } else {
      state.streak = 0;
      state.wrong.push(w);
      el.feedback.className = 'feedback bad';
      el.feedback.textContent = t('wrong') + correctText;
      var exBad = document.createElement('span');
      exBad.className = 'ex';
      exBad.textContent = w.de + ' —— ' + (w.ex || '');
      el.feedback.appendChild(exBad);
    }

    el.okCount.textContent = state.ok;
    el.streak.textContent = state.streak;
    el.nextBtn.disabled = false;
    el.nextBtn.focus();
  }

  function next() {
    if (!state.answered) return;
    if (state.idx < state.deck.length - 1) {
      state.idx++;
      render();
    } else {
      showResult();
    }
  }

  function bestKey() { return el.mode.value + '|' + el.scope.value; }

  function getBest() {
    try {
      var o = JSON.parse(localStorage.getItem(K_BEST) || '{}');
      return o[bestKey()] || 0;
    } catch (e) { return 0; }
  }

  function setBest(v) {
    try {
      var o = JSON.parse(localStorage.getItem(K_BEST) || '{}');
      if (!o[bestKey()] || v > o[bestKey()]) {
        o[bestKey()] = v;
        localStorage.setItem(K_BEST, JSON.stringify(o));
      }
    } catch (e) { /* 隐私模式下忽略 */ }
  }

  function showResult() {
    var total = state.deck.length;
    var rate = total ? Math.round(state.ok / total * 100) : 0;
    var prevBest = getBest();
    setBest(state.ok);
    var best = getBest();

    el.card.hidden = true;
    el.result.hidden = false;
    el.resScore.textContent = state.ok;
    el.resTotal.textContent = total;
    el.resTitle.textContent = rate === 100 ? t('perfect') : (rate >= 70 ? t('good') : t('poor'));
    el.resMeta.textContent = t('rate') + rate + '%' + t('best') + best + t('best2') +
      (prevBest ? t('prev') + prevBest + t('prevEnd') : '');

    el.wrongHead.textContent = t('wrongHead');
    el.wrongList.innerHTML = '';
    if (!state.wrong.length) {
      var li0 = document.createElement('li');
      li0.textContent = t('noWrong');
      el.wrongList.appendChild(li0);
    } else {
      state.wrong.forEach(function (w) {
        var li = document.createElement('li');
        var de = document.createElement('span');
        de.className = 'de';
        de.textContent = w.de;
        li.appendChild(de);
        li.appendChild(document.createTextNode(' — ' + w.zh));
        var ex = document.createElement('span');
        ex.className = 'ex';
        ex.textContent = w.ex || '';
        li.appendChild(ex);
        el.wrongList.appendChild(li);
      });
    }
  }

  el.nextBtn.addEventListener('click', next);
  ['againBtn', 'backBtn', 'restartBtn'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', buildDeck);
  });
  [el.mode, el.scope, el.len].forEach(function (s) {
    s.addEventListener('change', buildDeck);
  });

  /* 说中文就点 1–4 选答案，Enter 下一题（同时照顾键盘用户） */
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'SELECT') return;
    if (e.key >= '1' && e.key <= '4') {
      var opts = el.options.querySelectorAll('.opt');
      var i = parseInt(e.key, 10) - 1;
      if (opts[i] && !opts[i].disabled) opts[i].click();
      return;
    }
    if (e.key === 'Enter' && !el.nextBtn.disabled) {
      e.preventDefault();
      next();
    }
  });

  /* 切语言后把当前这题的提示文案刷新一下 */
  document.addEventListener('languagechange', function () {
    if (el.result.hidden === false) {
      showResult();
    } else if (state.deck.length) {
      var keep = state.answered;
      var q = state.deck[state.idx];
      el.qLabel.textContent = (el.mode.value === 'de-zh') ? t('qDeZh') : t('qZhDe');
      el.qWord.textContent = (el.mode.value === 'de-zh') ? q.w.de : q.w.zh;
      el.nextBtn.textContent = (state.idx === state.deck.length - 1) ? t('last') : t('next');
      if (!keep) { /* 未作答时反馈区本来就是空的 */ }
    }
  });

  buildDeck();
})();
