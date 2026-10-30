/* ===========================================================
   深色 / 浅色切换
   -----------------------------------------------------------
   颜色全部在 css/style.css 里：浅色是 :root 的默认值，
   深色是文件末尾 html[data-theme="dark"] 那一段的覆盖。
   这个文件只负责三件事：

     1. 记住用户的选择（localStorage），下次打开还是那个颜色
     2. 第一次访问时跟随系统（prefers-color-scheme）
     3. 更新按钮的 aria-pressed / aria-label（中英双语）

   注意：真正"不闪白"是在每个页面 <head> 里的一小段内联脚本，
   它在 CSS 之前就把 data-theme 设好；这里是后续交互。
   =========================================================== */

(function () {
  'use strict';

  var KEY = 'theme';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var meta = document.querySelector('meta[name="theme-color"]');

  function isEnglish() {
    return document.documentElement.lang === 'en';
  }

  /* 按钮的提示文字跟着当前语言走（不放进 i18n 词典，因为它是"切换后"的动态状态） */
  function labelFor(theme) {
    if (isEnglish()) {
      return theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
    return theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label', labelFor(theme));
    }
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#16140f' : '#fbf9f4');
    }
  }

  function initial() {
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* 隐私模式读不到 localStorage */ }
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  apply(initial());

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* 忽略 */ }
    });
  }

  /* 切语言后，按钮的 aria-label 要跟着变成另一种语言 */
  document.addEventListener('languagechange', function () {
    apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  });
})();
