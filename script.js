// script.js (debug-friendly)
const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec"; // <-- เปลี่ยนถ้าจำเป็น

const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const responseMsg = document.getElementById("responseMsg");
const submitBtn = document.getElementById("submitBtn");

let q1Value = "";
let q2Value = "";

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function showMsg(text, color = "red", rawDetails = "") {
  responseMsg.style.color = color;
  responseMsg.classList.remove("hidden");
  // include details in a <details> so user can expand if they want
  if (rawDetails) {
    responseMsg.innerHTML = `<span>${escapeHtml(text)}</span>
      <details style="margin-top:8px;text-align:left;"><summary>แสดงรายละเอียด</summary><pre style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(rawDetails)}</pre></details>`;
  } else {
    responseMsg.textContent = text;
  }
}

// Q1 clickable
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => { o.classList.remove("active"); o.setAttribute("aria-checked","false"); });
    opt.classList.add("active");
    opt.setAttribute("aria-checked","true");
    q1Value = opt.dataset.value;
    if (q1Value === "1" || q1Value === "2") {
      q2Section.classList.remove("hidden");
    } else {
      q2Section.classList.add("hidden");
      q2Value = "";
      q2Other.value = "";
      q2Other.classList.add("hidden");
      document.querySelectorAll('input[name="q2"]').forEach(r => r.checked = false);
    }
  });

  // keyboard accessibility (Enter/Space)
  opt.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      opt.click();
    }
  });
});

// Q2 radios
document.querySelectorAll('input[name="q2"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "อื่นๆ") {
      q2Other.classList.remove("hidden");
    } else {
      q2Other.classList.add("hidden");
      q2Other.value = "";
    }
    q2Value = radio.value;
  });
});

async function postToWebApp(params) {
  // params: URLSearchParams or FormData or string
  const url = WEBAPP_URL + "?cachebust=" + Date.now();
  return fetch(url, {
    method: "POST",
    body: params
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let finalQ2 = q2Value === "อื่นๆ" ? q2Other.value.trim() : q2Value;

  if (!q1Value) {
    showMsg("กรุณาเลือกระดับความพึงพอใจ", "red");
    return;
  }

  if ((q1Value === "1" || q1Value === "2") && !finalQ2) {
    showMsg("กรุณาระบุสาเหตุที่ไม่พึงพอใจ", "red");
    return;
  }

  const params = new URLSearchParams({
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value.trim()
  });

  submitBtn.disabled = true;
  submitBtn.textContent = "กำลังบันทึก...";

  try {
    const res = await postToWebApp(params);

    const rawText = await res.text().catch(() => "");
    let parsed = null;
    try { parsed = JSON.parse(rawText); } catch (err) { /* not JSON */ }

    if (!res.ok) {
      // HTTP-level error
      const details = `HTTP ${res.status} ${res.statusText}\n\nResponse body:\n${rawText}`;
      showMsg("บันทึกไม่สำเร็จ (HTTP error)", "red", details);
      console.error("HTTP error", details);
    } else if (parsed && parsed.status && parsed.status === "success") {
      showMsg("บันทึกข้อมูลเรียบร้อย ขอบคุณที่ตอบแบบสอบถาม", "green");
      // keep message visible (user can clear by sending again)
      form.reset();
      q1Options.forEach(o => { o.classList.remove("active"); o.setAttribute("aria-checked","false"); });
      q1Value = "";
      q2Value = "";
      q2Section.classList.add("hidden");
      q2Other.classList.add("hidden");
    } else {
      // server returned non-success JSON or text
      const serverMsg = (parsed && parsed.message) ? parsed.message : rawText || "ไม่ทราบสาเหตุ";
      const details = `HTTP ${res.status} ${res.statusText}\n\nParsed JSON:\n${parsed ? JSON.stringify(parsed, null, 2) : "(not JSON)"}\n\nRaw response:\n${rawText}`;
      showMsg(`บันทึกไม่สำเร็จ: ${serverMsg}`, "red", details);
      console.error("Server returned error", details);
    }
  } catch (err) {
    // network / CORS / fetch error
    showMsg("เกิดข้อผิดพลาดขณะบันทึก (network). ดู console สำหรับรายละเอียด", "red", String(err));
    console.error("Fetch error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "ส่งแบบประเมิน";
  }
});
