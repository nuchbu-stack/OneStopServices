const form = document.getElementById("surveyForm");
const q1radios = document.querySelectorAll('input[name="q1"]');
const q2Container = document.getElementById("q2-container");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2_other");
const successMsg = document.getElementById("successMsg");

q1radios.forEach(radio => {
  radio.addEventListener("change", () => {
    if(radio.value === "1" || radio.value === "2") {
      q2Container.style.display = "block";
    } else {
      q2Container.style.display = "none";
      q2Select.value = "ไม่มี";
      q2Other.value = "";
      q2Other.style.display = "none";
    }
  });
});

q2Select.addEventListener("change", () => {
  if(q2Select.value === "อื่นๆ") {
    q2Other.style.display = "block";
    q2Other.required = true;
  } else {
    q2Other.style.display = "none";
    q2Other.required = false;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    q1: form.q1.value,
    q2: q2Select.value === "อื่นๆ" ? q2Other.value : q2Select.value,
    q3: form.q3.value
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec?cachebust=" + Date.now(), {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if(result.status === "success") {
      successMsg.style.display = "block";
      form.reset();
      q2Container.style.display = "none";
      q2Other.style.display = "none";
      setTimeout(()=>{ successMsg.style.display = "none"; }, 2000);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
      console.error(result.message);
    }
  } catch(err) {
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    console.error(err);
  }
});
