// ================================
// サイト主が自由に変えられる設定部分
// ================================
const DEADLINE = "2026-03-15T23:59:59";  // 申し込み期限
const MAX_PEOPLE = 15;                   // 最大人数
const WEBHOOK_URL = "https://hyperform.jp/api/eULaUAI8"; // ハイパーフォームWebhook
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
  submitBtn.disabled = !ok;
}

// 入力イベントにチェック関数を設定
liveType.onchange = checkInputs;
nameInput.oninput = checkInputs;
countInput.oninput = checkInputs;

// ローカルストレージから保存データを復元
const savedData = JSON.parse(localStorage.getItem("formData"));
const isSubmitted = localStorage.getItem("submitted");

// 送信済みなら完了画面を表示
if (isSubmitted && savedData) {
  formSection.style.display = "none";
  finishSection.style.display = "block";
  document.getElementById("finishMsg").innerHTML =
    `${savedData.name} さん、来場者人数 ${savedData.count} 名。<br>申し込みありがとうございます。`;
} else if (savedData) {
  // 送信前の場合は入力値を復元
  liveType.value = savedData.live_type || savedData.liveType || "";
  nameInput.value = savedData.name || "";
  countInput.value = savedData.count || "";
  checkInputs();
}

// ★ 送信処理
submitBtn.addEventListener("click", async () => {
  const data = {
    live_type: liveType.value,
    name: nameInput.value,
    count: countInput.value
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      console.error("送信失敗:", response.statusText);
      alert("送信に失敗しました。もう一度お試しください。");
      return;
    }
  } catch (err) {
    console.error("送信エラー:", err);
    alert("送信中にエラーが発生しました。");
    return;
  }

  // ローカル保存
  localStorage.setItem("formData", JSON.stringify(data));
  localStorage.setItem("submitted", "true"); // 送信済みフラグ

  // 画面切り替え
  formSection.style.display = "none";
  document.getElementById("finishMsg").innerHTML =
    `${data.name} さん、来場者人数 ${data.count} 名。<br>申し込みありがとうございます。`;
  finishSection.style.display = "block";
});

// キャンセル → 元画面に戻す
document.getElementById("cancelBtn").addEventListener("click", () => {
  finishSection.style.display = "none";
  formSection.style.display = "block";
  localStorage.removeItem("submitted"); // 送信フラグをリセット
});
