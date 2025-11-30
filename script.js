// ================================
// サイト主が自由に変えられる 設定部分
// ================================
const DEADLINE = "2026-03-15T23:59:59";  // 申し込み期限
const MAX_PEOPLE = 15;                   // 最大人数
const WEBHOOK_URL = "https://hyperform.jp/api/axr2LpKf";
// ================================

// HTML要素を取得
const liveType = document.getElementById("liveType");
const nameInput = document.getElementById("name");
const countInput = document.getElementById("count");
const submitBtn = document.getElementById("submitBtn");
const finishSection = document.getElementById("finishSection");
const formSection = document.getElementById("formSection");

// 人数上限を設定
countInput.max = MAX_PEOPLE;

// タイトルと期限表示
const now = new Date();
const limit = new Date(DEADLINE);
document.getElementById("limitMessage").innerText =
  `申し込み期限：${limit.toLocaleString()}`;

// 期限切れならフォームを消す
if (now > limit) {
  document.body.innerHTML = "<h2>申し込み期間は終了しました。</h2>";
}

// 入力チェック・送信ボタンの有効/無効
function checkInputs() {
  const ok =
    liveType.value !== "" &&
    nameInput.value.trim() !== "" &&
    countInput.value > 0;

  // ← ここを修正
  submitBtn.disabled = !ok;
}

liveType.onchange = checkInputs;
nameInput.oninput = checkInputs;
countInput.oninput = checkInputs;

// 保存データがあれば復元
const saved = JSON.parse(localStorage.getItem("formData"));
if (saved) {
  liveType.value = saved.live_type;
  nameInput.value = saved.name;
  countInput.value = saved.count;
  checkInputs();
}

// ★ 送信処理
submitBtn.addEventListener("click", async () => {
  const data = {
    live_type: liveType.value,
    name: nameInput.value,
    count: countInput.value
  };

  // テスト時はコメントアウトして動作確認
  // await fetch(WEBHOOK_URL, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data)
  // });

  // ローカル保存
  localStorage.setItem("formData", JSON.stringify(data));

  // 画面切り替え
  formSection.style.display = "none";
  document.getElementById("finishMsg").innerHTML =
    `${data.name} さん、来場者人数 ${data.count} 名。	<br>申し込みありがとうございます。`;
  finishSection.style.display = "block";
});

// キャンセル → 元画面に戻す
document.getElementById("cancelBtn").addEventListener("click", () => {
  finishSection.style.display = "none";
  formSection.style.display = "block";
});