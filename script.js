const form = document.getElementById("surveyForm");
const q1Radios = document.getElementsByName("q1");
const q2Div = document.querySelector(".q2");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2_other");
const successMsg = document.getElementById("successMsg");

// Show q2 only if q1 <= 2
q1Radios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value <= 2) {
      q2Div.classList.remove("hidden");
      q2Div.parentNode.insertBefore(q2Div, document.querySelector(".q3"));
    } else {
      q2Div.classList.add("hidden");
      q2Select.value = "ไม่มี";
      q2Other.value = "";
      q2Other.classList.add("hidden");
    }
  });
});

// Show "other" input
q2Select.addEventListener("change", () => {
  if (q2Select.value === "อื่นๆ") {
    q2Other.classList.remove("hidden");
    q2Other.required = true;
  } else {
    q2Other.classList.add("hidden");
    q2Other.required = false;
  }
});

// Submit form
form.addEventListener("submit", async e => {
  e.preventDefault();

  let q2Value = q2Select.value;
  if (q2Value === "อื่นๆ") q2Value = q2Other.value;

  const data = {
    q1: form.q1.value,
    q2: q2Value,
    q3: form.q3.value
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.status === "success") {
      successMsg.classList.remove("hidden");
      form.reset();
      q2Div.classList.add("hidden");
      q2Other.classList.add("hidden");
      setTimeout(() => {
        successMsg.classList.add("hidden");
      }, 3000);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
  }
});
