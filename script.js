const form = document.getElementById("surveyForm");
const thankYou = document.getElementById("thankYou");
const q1Options = document.querySelectorAll(".option");
const q2Section = document.getElementById("q2Section");
const q2OtherRadio = document.getElementById("q2OtherRadio");
const q2Other = document.getElementById("q2Other");

let q1Value = "";

// handle Q1 select
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Value = opt.dataset.value;

    // show Q2 only if low satisfaction
    if (q1Value <= 3) {
      q2Section.classList.remove("hidden");
    } else {
      q2Section.classList.add("hidden");
    }
  });
});

// handle Q2 Other
q2OtherRadio.addEventListener("change", () => {
  q2Other.classList.remove("hidden");
});
document.querySelectorAll("input[name='q2']").forEach(r => {
  r.addEventListener("change", () => {
    if (r.value !== "อื่นๆ") {
      q2Other.classList.add("hidden");
      q2Other.value = "";
    }
  });
});

// handle submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;

  // Q1 validation
  if (!q1Value) {
    document.getElementById("q1Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q1Error").classList.add("hidden");
  }

  // Q2 validation
  if (q1Value <= 3) {
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

  // Q3 validation
  if (!document.getElementById("q3").value.trim()) {
    document.getElementById("q3Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q3Error").classList.add("hidden");
  }

  if (!valid) return;

  // payload
  const payload = new URLSearchParams({
    q1: q1Value,
    q2: document.querySelector("input[name='q2']:checked")?.value || "",
    q3: document.getElementById("q3").value.trim()
  });

  try {
    await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec", {
      method: "POST",
      body: payload
    });
  } catch (err) {
    console.error("ส่งข้อมูลไม่สำเร็จ", err);
  }

  form.classList.add("hidden");
  thankYou.classList.remove("hidden");
});
