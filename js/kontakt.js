// 联系表单：前端校验 + 确认信息（本站没有后端，故阻止真正的提交）
const form = document.querySelector("#kontakt-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", function (event) {
  // 没有后端服务器，所以拦下浏览器的默认提交（否则会刷新页面）
  event.preventDefault();

  // 如果浏览器原生的必填/邮箱格式校验没通过，就让它给出提示
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.querySelector("#name").value.trim();
  status.textContent = name + "，谢谢你的留言！你的输入已通过校验。本站是课程项目，没有后端，所以这封信不会真的发出去。";
  form.reset();
});
