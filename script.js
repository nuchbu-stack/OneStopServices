const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const thankYou = document.getElementById("thankYou");

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

  if (!q1Value) {
    alert("กรุณาเลือกระดับความพึงพอใจ");
    return;
  }

  if ((q1Value === "1" || q1Value === "2") && q2Value === "อื่นๆ" && !finalQ2) {
    alert("กรุณาระบุรายละเอียดในช่อง 'อื่นๆ'");
    return;
  }

  const payload = new URLSearchParams({
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value
  });

  // ✅ แสดง thank you page
  form.classList.add("hidden");
  thankYou.classList.remove("hidden");

  // Reset form
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
  } catch (err) {
    console.error("ส่งข้อมูลไม่สำเร็จ (background)", err);
  }
});

// ลิงก์ทำแบบสอบถามอีกครั้ง
document.getElementById("againLink").addEventListener("click", (e) => {
  e.preventDefault();
  thankYou.classList.add("hidden");
  form.classList.remove("hidden");
});
