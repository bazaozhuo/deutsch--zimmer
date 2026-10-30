/* ===========================================================
   联系页：表单 + 邮箱
   -----------------------------------------------------------
   本站没有后端，所以「发送」不会把数据发给服务器，而是：
     1. 先用浏览器原生校验（checkValidity / reportValidity）
     2. 把填好的内容拼成 mailto: 链接，交给用户自己的邮件客户端
     3. 页面给出提示，并说明可以在发之前再检查一遍

   这样做的好处（能讲的点）：
   - 真的能用，不是"假表单"；
   - 不需要任何服务器/第三方服务，符合课程"无后端"的要求；
   - 用户自己按下发送键，隐私上更干净。
   =========================================================== */

(function () {
  'use strict';

  var MAIL = 'X20250028@stu.hibiuh.edu.cn';

  var form = document.querySelector('#kontakt-form');
  var status = document.querySelector('#form-status');
  var copyBtn = document.querySelector('#copy-mail');
  var mailMsg = document.querySelector('#mail-msg');

  /* 脚本生成的文字，HTML 里没有原文可快照，所以两种语言各写一份 */
  var T = {
    zh: {
      sent: '{name}，好的！你的邮件客户端应该已经打开了，信是发给 ' + MAIL + ' 的。没反应的话直接复制上面的地址手动写。',
      copyOk: '地址已复制：' + MAIL,
      copyFail: '复制失败，请手动选中地址复制。'
    },
    en: {
      sent: '{name}, done! Your mail app should have opened with a message to ' + MAIL + '. If nothing happened, copy the address above and write manually.',
      copyOk: 'Address copied: ' + MAIL,
      copyFail: 'Copy failed — please select the address and copy it manually.'
    }
  };

  function lang() {
    return (window.i18n && window.i18n.lang === 'en') ? 'en' : 'zh';
  }

  function t(key) {
    return T[lang()][key];
  }

  /* 打开 mailto：把表单内容预填进去 */
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();          /* 没有服务器，拦下默认提交，避免刷新页面 */

      if (!form.checkValidity()) {     /* 交给浏览器原生的必填/格式校验 */
        form.reportValidity();
        return;
      }

      var name = document.querySelector('#name').value.trim();
      var email = document.querySelector('#email').value.trim();
      var thema = document.querySelector('#thema');
      var subject = thema.options[thema.selectedIndex].textContent.trim();
      var text = document.querySelector('#nachricht').value.trim();

      var body = text + '\n\n---\n' + name + (email ? ' <' + email + '>' : '');
      var href = 'mailto:' + MAIL +
                 '?subject=' + encodeURIComponent('[德语自习室] ' + subject) +
                 '&body=' + encodeURIComponent(body);

      status.textContent = t('sent').replace('{name}', name);
      window.location.href = href;
      form.reset();
    });
  }

  /* 复制邮箱地址 */
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var ok = false;
      try {
        var ta = document.createElement('textarea');
        ta.value = MAIL;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {
        ok = false;
      }
      if (!ok && navigator.clipboard) {
        navigator.clipboard.writeText(MAIL).then(function () {
          mailMsg.textContent = t('copyOk');
        }, function () {
          mailMsg.textContent = t('copyFail');
        });
        return;
      }
      mailMsg.textContent = ok ? t('copyOk') : t('copyFail');
    });
  }

  /* 切换语言时清掉旧语言的提示，避免中英混排 */
  document.addEventListener('languagechange', function () {
    if (status) status.textContent = '';
    if (mailMsg) mailMsg.textContent = '';
  });
})();
