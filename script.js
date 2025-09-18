const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const responseMsg = document.getElementById("responseMsg");

// กำหนด URL ของ Google Apps Script ไว้ในตัวแปรคงที่
const GAS_URL = "https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec";

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

  if (!q1Value) {
    responseMsg.textContent = "กรุณาเลือกระดับความพึงพอใจ";
    responseMsg.style.color = "red";
    responseMsg.classList.remove("hidden");
    return;
  }

  // แสดงสถานะ "กำลังบันทึก" และปิดการใช้งานปุ่ม
  submitButton.disabled = true;
  submitButton.textContent = "กำลังบันทึกข้อมูล...";
  responseMsg.textContent = "";
  responseMsg.classList.add("hidden");

  let finalQ2 = q2Value === "อื่นๆ" ? q2Other.value : q2Value;

  const payload = {
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value
  };

  try {
    const res = await fetch(GAS_URL + "?cachebust=" + new Date().getTime(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
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