const form = document.getElementById("surveyForm");
const q1Service = document.getElementById("q1Service");
const q2Options = document.querySelectorAll("#q2Options .option");
const q3Section = document.getElementById("q3Section");
const q3Other = document.getElementById("q3Other");
const thankYou = document.getElementById("thankYou");

let q2Value = "";
let q3Value = "";

// Q2 logic (ความพึงพอใจ)
q2Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q2Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q2Value = opt.dataset.value;

    if (q2Value === "1" || q2Value === "2") {
      q3Section.classList.remove("hidden");
    } else {
      q3Section.classList.add("hidden");
      q3Value = "";
      q3Other.value = "";
      q3Other.classList.add("hidden");
      document.querySelectorAll('input[name="q3"]').forEach(r => r.checked = false);
    }
  });
});

// Q3 logic (เหตุผลไม่พอใจ)
document.querySelectorAll('input[name="q3"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "อื่นๆ") {
      q3Other.classList.remove("hidden");
    } else {
      q3Other.classList.add("hidden");
      q3Other.value = "";
    }
    q3Value = radio.value;
  });
});

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let finalQ3 = q3Value === "อื่นๆ" ? q3Other.value.trim() : q3Value;

  if (!q1Service.value) {
    alert("กรุณาเลือกเรื่องที่รับบริการ");
    return;
  }

  if (!q2Value) {
    alert("กรุณาเลือกระดับความพึงพอใจ");
    return;
  }

  if ((q2Value === "1" || q2Value === "2") && q3Value === "อื่นๆ" && !finalQ3) {
    alert("กรุณาระบุรายละเอียดในช่อง 'อื่นๆ'");
    return;
  }

  const payload = new URLSearchParams({
    q1Service: q1Service.value,
    q2: q2Value,
    q3: finalQ3 || "",
    q4: document.getElementById("q4").value
  });

  // ✅ แสดง thank you page
  form.classList.add("hidden");
  thankYou.classList.remove("hidden");

  // Reset form
  form.reset();
  q2Options.forEach(o => o.classList.remove("active"));
  q2Value = "";
  q3Section.classList.add("hidden");
  q3Other.classList.add("hidden");

  // ส่งข้อมูลไป Google Sheet เบื้องหลัง
  try {
    await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec?cachebust=" + new Date().getTime(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q1Service: q1Service.value,
        q2: q2Value,
        q3: finalQ3 || "",
        q4: document.getElementById("q4").value
      })
    });
  } catch (err) {
    console.error("ส่งข้อมูลไม่สำเร็จ (background)", err);
  }
});

// ปุ่มทำใหม่
document.getElementById("againBtn").addEventListener("click", () => {
  thankYou.classList.add("hidden");
  form.classList.remove("hidden");
});
