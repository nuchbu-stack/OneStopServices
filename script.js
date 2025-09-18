const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const responseMsg = document.getElementById("responseMsg");

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
  
  const submitButton = form.querySelector('button[type="submit"]');

  let finalQ2 = q2Value === "อื่นๆ" ? q2Other.value : q2Value;

  if (!q1Value) {
    responseMsg.textContent = "กรุณาเลือกระดับความพึงพอใจ";
    responseMsg.style.color = "red";
    responseMsg.classList.remove("hidden");
    return;
  }

  // ปิดการใช้งานปุ่มเพื่อป้องกันการส่งซ้ำ
  submitButton.disabled = true;
  submitButton.textContent = "กำลังส่ง...";
  responseMsg.classList.add("hidden");

  const payload = new URLSearchParams({
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value
  });

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec?cachebust=" + new Date().getTime(), {
      method: "POST",
      body: payload
    });
    const data = await res.json();

    if (data.status === "success") {
      responseMsg.textContent = "บันทึกข้อมูลเรียบร้อย ขอบคุณที่ตอบแบบสอบถาม";
      responseMsg.style.color = "green";
      responseMsg.classList.remove("hidden");
      form.reset();
      q1Options.forEach(o => o.classList.remove("active"));
      q1Value = "";
      q2Section.classList.add("hidden");
      q2Other.classList.add("hidden");
    } else {
      throw new Error(data.message || "Unknown error");
    }
  } catch (err) {
    responseMsg.textContent = "เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่";
    responseMsg.style.color = "red";
    responseMsg.classList.remove("hidden");
    console.error("Error submitting form:", err);
  } finally {
    // เปิดใช้งานปุ่มอีกครั้งเมื่อการทำงานเสร็จสิ้น
    submitButton.disabled = false;
    submitButton.textContent = "ส่งแบบประเมิน";
  }
});