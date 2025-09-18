const form = document.getElementById("surveyForm");
const q1Inputs = document.querySelectorAll('input[name="q1"]');
const q2Container = document.getElementById("q2-container");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2-other");
const successMsg = document.getElementById("successMsg");

// แสดง Q2 เฉพาะเวลาค่า ≤2
q1Inputs.forEach(input => {
  input.addEventListener("change", () => {
    const val = parseInt(input.value);
    if(val <=2) {
      q2Container.style.display = "block";
    } else {
      q2Container.style.display = "none";
      q2Select.value = "ไม่มี";
      q2Other.style.display = "none";
      q2Other.value = "";
    }
  });
});

// แสดง input "อื่นๆ"
q2Select.addEventListener("change", () => {
  if(q2Select.value === "อื่นๆ") {
    q2Other.style.display = "block";
  } else {
    q2Other.style.display = "none";
    q2Other.value = "";
  }
});

// ส่งฟอร์ม
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    q1: form.q1.value,
    q2: q2Select.value === "อื่นๆ" ? q2Other.value : q2Select.value,
    q3: form.q3.value
  };

  try {
    const resp = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec", {
      method: "POST",
      body: new URLSearchParams(data)
    });
    const result = await resp.json();
    if(result.status === "success") {
      successMsg.style.display = "block";
      form.reset();
      q2Container.style.display = "none";
      q2Other.style.display = "none";
      // reset active state
      q1Inputs.forEach(i => i.checked = false);
      setTimeout(()=>{ successMsg.style.display="none"; }, 3000);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    }
  } catch(err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
  }
});
