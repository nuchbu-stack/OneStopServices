const form = document.getElementById("surveyForm");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2_other");

// แสดงช่องอื่นๆ ถ้าเลือก "อื่นๆ"
q2Select.addEventListener("change", function() {
  if (this.value === "อื่นๆ") {
    q2Other.classList.remove("hidden");
    q2Other.required = true;
  } else {
    q2Other.classList.add("hidden");
    q2Other.required = false;
  }
});

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  let q2Value = q2Select.value;
  if (q2Value === "อื่นๆ") {
    q2Value = q2Other.value;
  }

  const formData = new URLSearchParams({
    q1: form.q1.value,
    q2: q2Value,
    q3: form.q3.value
  });

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec", { // <-- ใส่ URL ของ Web App
      method: "POST",
      body: formData
    });
    const result = await response.json();
    if (result.status === "success") {
      form.reset();
      q2Other.classList.add("hidden");
      q2Other.required = false;
      document.getElementById("successMsg").classList.remove("hidden");
      setTimeout(() => {
        document.getElementById("successMsg").classList.add("hidden");
      }, 3000);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
      console.error(result.message);
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    console.error(err);
  }
});
