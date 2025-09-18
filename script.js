document.addEventListener("DOMContentLoaded", function() {
  const q1Radios = document.querySelectorAll('input[name="q1"]');
  const q2Container = document.getElementById('q2-container');
  const q2Select = document.getElementById('q2');
  const q2Other = document.getElementById('q2_other');
  const form = document.getElementById('surveyForm');
  const successMsg = document.getElementById('successMsg');

  // แสดง/ซ่อนคำถามไม่พึงพอใจ
  q1Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === "1" || radio.value === "2") {
        q2Container.style.display = "block";
      } else {
        q2Container.style.display = "none";
        q2Select.value = "ไม่มี";
        q2Other.value = "";
        q2Other.style.display = "none";
      }
    });
  });

  // แสดงช่องโปรดระบุ
  q2Select.addEventListener('change', () => {
    if (q2Select.value === "อื่นๆ") {
      q2Other.style.display = "block";
      q2Other.required = true;
    } else {
      q2Other.style.display = "none";
      q2Other.required = false;
    }
  });

  // ส่งฟอร์ม
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const data = {
      q1: form.q1.value,
      q2: (form.q2.value === "อื่นๆ") ? form.q2_other.value : form.q2.value,
      q3: form.q3.value
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const resJson = await response.json();

      if (resJson.status === "success") {
        successMsg.style.display = "block";
        form.reset();
        q2Container.style.display = "none";
        q2Other.style.display = "none";
        setTimeout(() => successMsg.style.display = "none", 3000);
      } else {
        alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
        console.error(resJson.message);
      }
    } catch(err) {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
      console.error(err);
    }
  });
});
