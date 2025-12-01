const GAS_WEB_APP_URL = "YOUR_GAS_WEB_APP_URL";

// 要素取得
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formSection = document.getElementById("formSection");
const finishSection = document.getElementById("finishSection");
const finishMsg = document.getElementById("finishMsg");
const ticketSection = document.getElementById("ticketSection");
const ticketURL = document.getElementById("ticketURL");

// ----------------------
// ① 送信処理
// ----------------------
submitBtn.addEventListener("click", () => {
  const liveType = document.getElementById("liveType").value;
  const name = document.getElementById("name").value;
  const count = document.getElementById("count").value;

  if (!name || !count) {
    alert("全ての項目を入力してください。");
    return;
  }

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
      localStorage.setItem("entryId", data.id);

      finishMsg.textContent = `${name} さん、${count} 名の申し込みを受け付けました。（承認待ち）`;

      formSection.style.display = "none";
      finishSection.style.display = "block";
    });
});

// ----------------------
// ② 承認状態を確認
// ----------------------
function checkApproval() {
  const entryId = localStorage.getItem("entryId");
  if (!entryId) return;

  fetch(GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "check",
      id: entryId
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "承認済み") {
        ticketSection.style.display = "block";
        ticketURL.textContent = data.ticketURL;
        ticketURL.href = data.ticketURL;
        finishMsg.textContent = "承認されました！チケットはこちら↓";
      } else if (data.status === "非承認") {
        ticketSection.style.display = "none";
        finishMsg.textContent = "申し込みは承認されませんでした。";
      }
    });
}

// ページ読み込み時に確認
window.addEventListener("load", checkApproval);

// ----------------------
// ③ キャンセル：スプレッドシート行削除
// ----------------------
cancelBtn.addEventListener("click", () => {
  const entryId = localStorage.getItem("entryId");
  if (!entryId) return;

  if (!confirm("申込をキャンセルしますか？（スプレッドシートから削除されます）")) return;

  fetch(GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "delete",
      id: entryId
    })
  })
    .then(res => res.text())
    .then(() => {
      localStorage.removeItem("entryId");
      alert("キャンセルしました。");
      location.reload();
    });
});
