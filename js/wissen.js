/* ===========================================================
   知识索引页：搜索 + 分类筛选
   -----------------------------------------------------------
   思路（能讲的部分）：
   1. 条目本身是静态 HTML（<details>），不靠 JS 生成 ——
      关掉 JS 也能读，搜索引擎也看得见（渐进增强）。
   2. JS 只做两件事：按关键词隐藏/显示、按分类隐藏/显示。
   3. 搜索文本在页面加载时算好，存在 data-text 上，
      不用每次输入都重新读 DOM。
   4. 计数用 aria-live 播报，屏幕阅读器能听到"显示 2 条"。
   =========================================================== */

(function () {
  'use strict';

  var q = document.getElementById('q');
  var list = document.getElementById('list');
  if (!q || !list) return;

  var entries = Array.prototype.slice.call(list.querySelectorAll('.entry'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var shown = document.getElementById('shown');
  var total = document.getElementById('total');
  var empty = document.getElementById('empty');
  var cat = 'all';

  total.textContent = entries.length;

  /* 预先把每条的可见文字压成一行小写，搜索时直接 indexOf */
  entries.forEach(function (e) {
    e.dataset.text = e.textContent.toLowerCase().replace(/\s+/g, ' ');
  });

  function apply() {
    var kw = q.value.trim().toLowerCase();
    var n = 0;
    entries.forEach(function (e) {
      var okCat = (cat === 'all' || e.dataset.cat === cat);
      var okKw = !kw || e.dataset.text.indexOf(kw) !== -1;
      var ok = okCat && okKw;
      e.hidden = !ok;
      if (!ok) e.open = false;   /* 被筛掉的条目顺手收起，下次展开状态不残留 */
      if (ok) n++;
    });
    shown.textContent = n;
    empty.hidden = n !== 0;
  }

  q.addEventListener('input', apply);

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      cat = c.dataset.cat;
      chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
      apply();
    });
  });

  /* 按 / 跳到搜索框（键盘习惯） */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    q.focus();
  });

  apply();

  /* 切语言后正文会被整块替换（data-i18n-html），可搜索文本要跟着重算，
     否则英文模式下搜英文搜不到。延后一拍，等 i18n 把 innerHTML 换完。 */
  document.addEventListener('languagechange', function () {
    setTimeout(function () {
      entries.forEach(function (e) {
        e.dataset.text = e.textContent.toLowerCase().replace(/\s+/g, ' ');
      });
      apply();
    }, 0);
  });
})();
