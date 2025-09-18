const form = document.getElementById("surveyForm");
const q1Radios = document.getElementsByName("q1");
const q2Container = document.getElementById("q2-container");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2_other");
const successMsg = document.getElementById("successMsg");

// แสดงคำถาม "ไม่พึงพอใจ" เฉพาะเมื่อเลือก 2 หรือ 1
q1Radios.forEach(radio => {
  radio.addEventListener("change", () => {
    const val = radio.value;
    if (val === "1" || val === "2") {
      q2Container.style.display = "block";
    } else {
      q2Container.style.display = "none";
      q2Other.style.display = "none";
    }
  });
});

// แสดงช่องโปรดระบุเมื่อเลือก "อื่นๆ"
q2Select.addEventListener("change", function() {
  if (this.value === "อื่นๆ") {
    q2Other.style.display = "block";
    q2Other.required = true;
  } else {
    q2Other.style.display = "none";
    q2Other.required = false;
  }
});

// ส่งฟอร์มไป Apps Script
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let q2Val = q2Select.value;
  if (q2Val === "อื่นๆ") {
    q2Val = q2Other.value;
  }

  const data = {
    q1: form.q1.value,
    q2: q2Val,
    q3: form.q3.value
  };

  fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec", { // <-- แก้เป็น URL ของ Apps Script
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "success") {
      successMsg.style.display = "block";
      form.reset();
      q2Container.style.display = "none";
      q2Other.style.display = "none";
      setTimeout(() => { successMsg.style.display = "none"; }, 3000);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    }
  })
  .catch(err => {
    console.error(err);
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
  });
});
