/* ===========================================================
   首页交互
   -----------------------------------------------------------
   四块东西，都在这个文件里，每个函数只干一件事：
     1. 今日 5 词：从词库里随机抽 5 个，做成可翻面的卡片
     2. 学习进度：记住"学会了哪些词"，画进度条
     3. 参与：投稿一个词 / 提一条建议（存 localStorage，可复制导出）
     4. 图库：点图放大（灯箱）

   数据来源：VOKABELN / VOKABELN_B1 / VOKABELN_B1_2（三个数据文件）
   —— 和词汇表、单词挑战共用，加词只改数据文件。
   =========================================================== */

(function () {
  'use strict';

  var ALL = VOKABELN.concat(VOKABELN_B1, VOKABELN_B1_2);

  var K_MASTER = 'dz_mastered';   // 已学会的词（数组，存德语原形）
  var K_USER   = 'dz_user';       // 昵称
  var K_MYWORD = 'dz_mywords';    // 自己投稿的词
  var K_IDEA   = 'dz_ideas';      // 自己的建议

  /* 文案（跟随 <html lang>，i18n.js 会改它） */
  var T = {
    zh: {
      guest: '未登录',
      hello: '你好，',
      flip: '，翻面看例句',
      learned: '学会了',
      learnedDone: '已学会 ✓',
      back: '翻回去',
      noEx: '（这个词还没配例句）',
      saved: '记住了，只存在这台电脑上。换浏览器就没了。',
      emptyName: '名字是空的，先写一个。',
      needBoth: '德语和中文都得填。',
      wordAdded: '已加进列表（只在本机）。',
      needIdea: '先写两句再交。',
      ideaSaved: '记下来了。想让我看到就点右边的按钮复制。',
      nothingToCopy: '还没有建议可以复制。',
      copied: '已复制，粘贴到微信或邮件里发给我就行。',
      copyFail: '复制失败，请手动选中文字。',
      someone: '一位同学',
      tagMine: '我加的',
      tagPending: '待反馈',
      fbHeader: '【德语自习室 · 反馈】来自 '
    },
    en: {
      guest: 'not signed in',
      hello: 'Hi, ',
      flip: ' — tap to flip for an example',
      learned: 'Learned it',
      learnedDone: 'Learned ✓',
      back: 'Flip back',
      noEx: '(no example yet)',
      saved: 'Saved — this browser only. Another browser will not see it.',
      emptyName: 'Name is empty — type one first.',
      needBoth: 'German and Chinese are both required.',
      wordAdded: 'Added to the list (this browser only).',
      needIdea: 'Write a line or two first.',
      ideaSaved: 'Saved. Use the copy button to send it to me.',
      nothingToCopy: 'No suggestions to copy yet.',
      copied: 'Copied — paste it into WeChat or an email.',
      copyFail: 'Copy failed — please select the text manually.',
      someone: 'a fellow student',
      tagMine: 'mine',
      tagPending: 'pending',
      fbHeader: '[Deutsch-Lernzimmer · feedback] from '
    }
  };

  function t(key) {
    var l = (document.documentElement.lang === 'en') ? 'en' : 'zh';
    return T[l][key];
  }

  function load(key, dflt) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : dflt;
    } catch (e) { return dflt; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 隐私模式忽略 */ }
  }

  function shuffleOnce(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* =========================================================
     1. 今日 5 词
     ========================================================= */
  var grid = document.getElementById('wordGrid');
  var mastered = load(K_MASTER, []);

  function pickWords(n) {
    var copy = ALL.slice();
    shuffleOnce(copy);
    return copy.slice(0, n);
  }

  function makeCard(w) {
    var done = mastered.indexOf(w.de) !== -1;

    var wrap = document.createElement('div');
    wrap.className = 'wcard';

    var inner = document.createElement('div');
    inner.className = 'wcard-inner';

    /* 正面：整面是一个真按钮（有 aria-label，键盘可点） */
    var front = document.createElement('div');
    front.className = 'wface';
    var flip = document.createElement('button');
    flip.type = 'button';
    flip.className = 'flip';
    flip.setAttribute('aria-label', w.de + t('flip'));

    var de = document.createElement('span'); de.className = 'de'; de.textContent = w.de;
    var pos = document.createElement('span'); pos.className = 'pos'; pos.textContent = w.pos || '';
    var zh = document.createElement('span'); zh.className = 'zh'; zh.textContent = w.zh;
    flip.appendChild(de); flip.appendChild(pos); flip.appendChild(zh);
    front.appendChild(flip);

    /* 背面：例句 + 两个真按钮（不嵌套按钮，HTML 才合法） */
    var back = document.createElement('div');
    back.className = 'wface wback';

    var ex = document.createElement('p');
    ex.className = 'ex';
    ex.textContent = w.ex || t('noEx');

    var actions = document.createElement('p');
    actions.className = 'wback-actions';

    var btnLearn = document.createElement('button');
    btnLearn.type = 'button';
    btnLearn.className = 'btn';
    btnLearn.textContent = done ? t('learnedDone') : t('learned');

    var btnBack = document.createElement('button');
    btnBack.type = 'button';
    btnBack.className = 'back-flip';
    btnBack.textContent = t('back');

    actions.appendChild(btnLearn);
    actions.appendChild(btnBack);
    back.appendChild(ex);
    back.appendChild(actions);

    flip.addEventListener('click', function () { wrap.classList.add('is-flipped'); });
    btnBack.addEventListener('click', function () { wrap.classList.remove('is-flipped'); });
    btnLearn.addEventListener('click', function () {
      if (mastered.indexOf(w.de) === -1) {
        mastered.push(w.de);
        save(K_MASTER, mastered);
      }
      btnLearn.textContent = t('learnedDone');
      updateProgress();
    });

    inner.appendChild(front);
    inner.appendChild(back);
    wrap.appendChild(inner);
    return wrap;
  }

  function renderWords() {
    if (!grid) return;
    grid.innerHTML = '';
    pickWords(5).forEach(function (w) {
      grid.appendChild(makeCard(w));
    });
  }

  function updateProgress() {
    var total = ALL.length + load(K_MYWORD, []).length;
    var countEl = document.getElementById('mCount');
    var totalEl = document.getElementById('mTotal');
    var fill = document.getElementById('barFill');
    if (countEl) countEl.textContent = mastered.length;
    if (totalEl) totalEl.textContent = total;
    if (fill) fill.style.width = (total ? (mastered.length / total * 100) : 0) + '%';
  }

  var reroll = document.getElementById('reroll');
  if (reroll) reroll.addEventListener('click', renderWords);

  /* =========================================================
     2. 昵称（本机）
     ========================================================= */
  var nameInput = document.getElementById('nameInput');
  var loginHint = document.getElementById('loginHint');
  var saveNameBtn = document.getElementById('saveName');

  function renderUser() {
    var n = load(K_USER, '');
    if (n && nameInput && !nameInput.value) nameInput.value = n;
    if (loginHint && n) loginHint.textContent = t('hello') + n + ' · ' + t('saved');
  }

  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', function () {
      var n = nameInput.value.trim();
      if (!n) {
        loginHint.textContent = t('emptyName');
        return;
      }
      save(K_USER, n);
      renderUser();
    });
  }

  /* =========================================================
     3. 投稿一个词
     ========================================================= */
  var myWords = load(K_MYWORD, []);
  var wordList = document.getElementById('myWordList');

  function renderMyWords() {
    if (!wordList) return;
    wordList.innerHTML = '';
    myWords.slice().reverse().forEach(function (w) {
      var li = document.createElement('li');
      var left = document.createElement('span');
      var strong = document.createElement('b');
      strong.textContent = w.de;
      left.appendChild(strong);
      left.appendChild(document.createTextNode(' — ' + w.zh));
      if (w.ex) {
        var exSpan = document.createElement('span');
        exSpan.style.display = 'block';
        exSpan.style.color = '#4a4a4a';
        exSpan.textContent = w.ex;
        left.appendChild(exSpan);
      }
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t('tagMine');
      li.appendChild(left);
      li.appendChild(tag);
      wordList.appendChild(li);
    });
  }

  var wordForm = document.getElementById('wordForm');
  if (wordForm) {
    wordForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var de = document.getElementById('wDe').value.trim();
      var zh = document.getElementById('wZh').value.trim();
      var ex = document.getElementById('wEx').value.trim();
      var msg = document.getElementById('wordMsg');
      if (!de || !zh) {
        msg.className = 'msg bad';
        msg.textContent = t('needBoth');
        return;
      }
      myWords.push({ de: de, zh: zh, ex: ex });
      save(K_MYWORD, myWords);
      renderMyWords();
      updateProgress();
      wordForm.reset();
      msg.className = 'msg ok';
      msg.textContent = t('wordAdded');
    });
  }

  /* =========================================================
     4. 建议 + 一键复制
     ========================================================= */
  var ideas = load(K_IDEA, []);
  var ideaList = document.getElementById('myIdeaList');
  var ideaText = document.getElementById('ideaText');

  function renderIdeas() {
    if (!ideaList) return;
    ideaList.innerHTML = '';
    ideas.slice().reverse().forEach(function (text) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.textContent = text;
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t('tagPending');
      li.appendChild(span);
      li.appendChild(tag);
      ideaList.appendChild(li);
    });
  }

  var ideaForm = document.getElementById('ideaForm');
  if (ideaForm) {
    ideaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('ideaMsg');
      var text = ideaText.value.trim();
      if (!text) {
        msg.className = 'msg bad';
        msg.textContent = t('needIdea');
        return;
      }
      ideas.push(text);
      save(K_IDEA, ideas);
      renderIdeas();
      ideaText.value = '';
      msg.className = 'msg ok';
      msg.textContent = t('ideaSaved');
    });
  }

  var copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var msg = document.getElementById('ideaMsg');
      if (!ideas.length) {
        msg.className = 'msg bad';
        msg.textContent = t('nothingToCopy');
        return;
      }
      var name = load(K_USER, '') || t('someone');
      var lines = ideas.map(function (text, i) { return (i + 1) + '. ' + text; });
      var payload = t('fbHeader') + name + '\n' + lines.join('\n');

      var ta = document.createElement('textarea');
      ta.value = payload;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      msg.className = 'msg ' + (ok ? 'ok' : 'bad');
      msg.textContent = ok ? t('copied') : t('copyFail');
    });
  }

  /* =========================================================
     5. 图片灯箱
     ========================================================= */
  var lb = document.getElementById('lightbox');
  var lbStage = document.getElementById('lbStage');
  var lbCap = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');

  function openLightbox(shot) {
    var img = shot.querySelector('img');
    if (!img) return;
    lbStage.innerHTML = '';
    var big = document.createElement('img');
    big.src = img.getAttribute('src');
    big.alt = img.getAttribute('alt') || '';
    lbStage.appendChild(big);
    lbCap.textContent = shot.dataset.cap || '';
    lb.classList.add('is-open');
    lbClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
  }

  Array.prototype.forEach.call(document.querySelectorAll('.shot'), function (shot) {
    shot.addEventListener('click', function () { openLightbox(shot); });
  });

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === lbClose) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
    });
  }

  /* =========================================================
     启动 / 切语言后重画
     ========================================================= */
  renderWords();
  renderUser();
  renderMyWords();
  renderIdeas();
  updateProgress();

  document.addEventListener('languagechange', function () {
    renderWords();
    renderMyWords();
    renderIdeas();
    renderUser();
  });
})();
