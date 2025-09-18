const form = document.getElementById("surveyForm");
const q1Radios = document.querySelectorAll("input[name='q1']");
const q2Container = document.getElementById("q2-container");
const q2Select = document.getElementById("q2");
const q2Other = document.getElementById("q2_other");
const successMsg = document.getElementById("successMsg");

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec"; // <-- ใส่ URL Web App ของคุณ

// แสดงคำถาม q2 เมื่อเลือก 1 หรือ 2
q1Radios.forEach(radio => {
  radio.addEventListener("change", () => {
    if(radio.value === "2" || radio.value === "1") {
      q2Container.style.display = "block";
    } else {
      q2Container.style.display = "none";
      q2Other.style.display = "none";
      q2Select.value = "ไม่มี";
      q2Other.value = "";
    }
  });
});

// แสดง input อื่นๆ ถ้าเลือก "อื่นๆ"
q2Select.addEventListener("change", () => {
  if(q2Select.value === "อื่นๆ") {
    q2Other.style.display = "block";
    q2Other.required = true;
  } else {
    q2Other.style.display = "none";
    q2Other.required = false;
  }
});

// ส่งฟอร์ม
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const q1 = form.q1.value;
  let q2 = form.q2.value;
  const q3 = form.q3.value;

  if(q2 === "อื่นๆ") q2 = q2Other.value;

  const data = { q1, q2, q3 };

  try {
    const res = await fetch(WEB_APP_URL + "?cachebust=" + Date.now(), {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if(result.status === "success") {
      successMsg.style.display = "block";
      setTimeout(() => {
        form.reset();
        q2Container.style.display = "none";
        q2Other.style.display = "none";
        successMsg.style.display = "none";
      }, 1500);
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    }

  } catch(err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
  }
});
