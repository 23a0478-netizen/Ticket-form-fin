// ---- 設定 ----
const GAS_WEB_APP_URL = "YOUR_GAS_WEB_APP_URL"; // ←差し替え必須

// ---- 要素取得 ----
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formSection = document.getElementById("formSection");
const finishSection = document.getElementById("finishSection");
const finishMsg = document.getElementById("finishMsg");
const ticketSection = document.getElementById("ticketSection");
const ticketURL = document.getElementById("ticketURL");

// ---- 送信ボタン ----
submitBtn.addEventListener("click", () => {
  const liveType = document.getElementById("liveType").value;
  const name = document.getElementById("name").value;
  const count = document.getElementById("count").value;

  if (!name || !count) {
    alert("全ての項目を入力してください。");
    return;
  }

  // データをGASへ送信
  fetch(GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "add",
      liveType,
      name,
      count
    })
  })
    .then(res => res.json())
    .then(data => {
      // 保存されたIDを localStorage に保存
      localStorage.setItem("entryId", data.id);

      formSection.style.display = "none";
      finishSection.style.display = "block";
      finishMsg.textContent = `${name} さん、${count}名。申し込みありがとうございます。（承認待ちです）`;
    });
});


// ---- キャンセルボタン（スプレッドシート削除機能）----
cancelBtn.addEventListener("click", () => {
  const entryId = localStorage.getItem("entryId");
  if (!entryId) {
    alert("削除対象の申込IDがありません。");
    return;
  }

  if (!confirm("申込をキャンセルしますか？（スプレッドシートからも削除されます）")) return;

  fetch(GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "delete",
      id: entryId
    })
  })
    .then(res => res.text())
    .then(result => {
      console.log("削除結果:", result);

      localStorage.removeItem("entryId");

      alert("申込をキャンセルしました。");

      finishSection.style.display = "none";
      formSection.style.display = "block";
    });
});
