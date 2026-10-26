// 联系表单：前端校验 + 确认信息（本站没有后端，故阻止真正的提交）
const form = document.querySelector("#kontakt-form");
const status = document.querySelector("#form-status");

// 提交后的提示文字：两种语言各一份（这段是脚本生成的，HTML 里没有原文可快照）
const SUCCESS = {
  zh: "{name}，谢谢你的留言！你的输入已通过校验。本站是课程项目，没有后端，所以这封信不会真的发出去。",
  en: "{name}, thank you for your message! Your input passed validation. This site is a course project with no backend, so the message was not actually sent."
};

function lang() {
  return window.i18n && window.i18n.lang === "en" ? "en" : "zh";
}

form.addEventListener("submit", function (event) {
  // 没有后端服务器，所以拦下浏览器的默认提交（否则会刷新页面）
  event.preventDefault();

  // 如果浏览器原生的必填/邮箱格式校验没通过，就让它给出提示
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.querySelector("#name").value.trim();
  status.textContent = SUCCESS[lang()].replace("{name}", name);
  form.reset();
});

// 切换语言时清掉旧语言的提示，避免中英混排
document.addEventListener("languagechange", function () {
  status.textContent = "";
});
