const form = document.getElementById("surveyForm");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2Other");
const responseMsg = document.getElementById("responseMsg");

let q1Value = "";

q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Value = opt.dataset.value;

    if (q1Value === "1" || q1Value === "2") {
      q2Section.classList.remove("hidden");
    } else {
      q2Section.classList.add("hidden");
      q2Select.value = "";
      q2Other.value = "";
      q2Other.classList.add("hidden");
    }
  });
});

q2Select.addEventListener("change", () => {
  if (q2Select.value === "อื่นๆ") {
    q2Other.classList.remove("hidden");
  } else {
    q2Other.classList.add("hidden");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q2Val = q2Select.value === "อื่นๆ" ? q2Other.value : q2Select.value;

  if (!q1Value) {
    responseMsg.textContent = "กรุณาเลือกระดับความพึงพอใจ";
    responseMsg.style.color = "red";
    responseMsg.classList.remove("hidden");
    return;
  }

  const payload = new URLSearchParams({
    q1: q1Value,
    q2: q2Val,
    q3: document.getElementById("q3").value
  });

  responseMsg.classList.add("hidden");

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
    console.error(err);
  }
});
