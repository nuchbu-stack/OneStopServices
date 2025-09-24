const form = document.getElementById("surveyForm");
const q0 = document.getElementById("q0");
const q0Other = document.getElementById("q0Other");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const thankYou = document.getElementById("thankYou");

let q0Value = "";
let q1Value = "";
let q2Value = "";


// แสดง/ซ่อน input อื่นๆ ของ Q0
q0.addEventListener("change", () => {
  if (q0.value === "อื่นๆ") {
    q0Other.classList.remove("hidden");
  } else {
    q0Other.classList.add("hidden");
    q0Other.value = "";
  }
  document.getElementById("q0Error").classList.add("hidden");
});

q0Other.addEventListener("input", () => {
  if (q0Other.value.trim() !== "") {
    document.getElementById("q0Error").classList.add("hidden");
  }
});

q0Value = q0.value === "อื่นๆ" ? q0Other.value.trim() : q0.value,


// Q1 logic
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Value = opt.dataset.value;

    // ซ่อน error ของ Q1 เมื่อเลือกแล้ว
    document.getElementById("q1Error").classList.add("hidden");

    if (q1Value === "1" || q1Value === "2") {
      q2Section.classList.remove("hidden");
      // ซ่อน error ของ Q2 เมื่อเลือกแล้ว
      document.getElementById("q2Error").classList.add("hidden");    
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
    
    document.getElementById("q2Error").classList.add("hidden");

    if (radio.value === "อื่นๆ") {
      q2Other.classList.remove("hidden");
    } else {
      q2Other.classList.add("hidden");
      q2Other.value = "";
    }
    q2Value = radio.value;
  });
});

// Q2 อื่นๆ text input
q2Other.addEventListener("input", () => {
  if (q2Other.value.trim() !== "") {
    document.getElementById("q2Error").classList.add("hidden");
  }
});

// handle submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;
  let finalQ2 = q2Value === "อื่นๆ" ? q2Other.value.trim() : q2Value;

  // Q0 validation
  if (!q0.value) {
    document.getElementById("q0Error").classList.remove("hidden");
    valid = false;
  } else if (q0.value === "อื่นๆ" && !q0Other.value.trim()) {
    document.getElementById("q0Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q0Error").classList.add("hidden");
  }


  // Q1 validation
  if (!q1Value) {
    document.getElementById("q1Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q1Error").classList.add("hidden");
  }

  // Q2 validation
  if (q1Value < 3) {
    let q2 = document.querySelector("input[name='q2']:checked")?.value || "";
    if (q2 === "อื่นๆ" && !q2Other.value.trim()) {
      document.getElementById("q2Error").classList.remove("hidden");
      valid = false;
    } else if (!q2) {
      document.getElementById("q2Error").classList.remove("hidden");
      valid = false;
    } else {
      document.getElementById("q2Error").classList.add("hidden");
    }
  } else {
    document.getElementById("q2Error").classList.add("hidden");
  }

  if (!valid) return;


  // payload
  const payload = new URLSearchParams({
    q0: q0Value || "",
    q1: q1Value,
    q2: finalQ2 || "",
    q3: document.getElementById("q3").value.trim()
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
    await fetch("https://script.google.com/macros/s/AKfycbyxrFQkIxujmY5dP2eDh8se5UJTpTUpM7xOIXqzGsFwnmi9b0I5IKypHwq9z2aAGeAg/exec?cachebust=" + new Date().getTime(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload
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
