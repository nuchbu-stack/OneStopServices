const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const responseMsg = document.getElementById("responseMsg");
const submitBtn = form.querySelector("button");

let q1Value = "";
let q2Value = "";

// Q1 logic
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
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
});

// Q2 logic
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let finalQ2 = q2Value === "อื่นๆ" ? q2Other.value.trim() : q2Value;

  // Validate Q1
  if (!q1Value) {
    showMessage("กรุณาเลือกระดับความพึงพอใจ", "error");
    return;
  }

  // Validate Q2 "อื่นๆ"
  if ((q1Value === "1" || q1Value === "2") && q2Value === "อื่นๆ" && !finalQ2) {
    showMessage("กรุณาระบุรายละเอียดในช่อง 'อื่นๆ'", "error");
    return;
  }

  const payload = new URLSearchParams({
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value
  });

  // ✅ แสดงข้อความสำเร็จทันที (optimistic UI)
  showMessage("บันทึกข้อมูลเรียบร้อยแล้ว ขอบคุณที่ตอบแบบสอบถาม", "success");

  // Reset form ให้พร้อมสำหรับรอบใหม่
  form.reset();
  q1Options.forEach(o => o.classList.remove("active"));
  q1Value = "";
  q2Section.classList.add("hidden");
  q2Other.classList.add("hidden");

  // ส่งข้อมูลไป Google Sheet เบื้องหลัง
  try {
    await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec?cachebust=" + new Date().getTime(), {
      method: "POST",
      body: payload
    });
    // ไม่ต้อง handle response แล้ว เพราะขึ้น success ไปก่อนแล้ว
  } catch (err) {
    console.error("ส่งข้อมูลไม่สำเร็จ (background)", err);
    // ไม่แจ้ง user เพื่อไม่ให้เสีย UX
  }
});

// Helper function
function showMessage(msg, type) {
  responseMsg.textContent = msg;
  responseMsg.className = type + " show"; // success/error + show

  // เคลียร์ timer เก่า (ถ้ามี)
  if (responseMsg.hideTimeout) {
    clearTimeout(responseMsg.hideTimeout);
  }

  // ซ่อนข้อความหลัง 10 วินาที
  responseMsg.hideTimeout = setTimeout(() => {
    responseMsg.classList.remove("show");
  }, 10000);
}
