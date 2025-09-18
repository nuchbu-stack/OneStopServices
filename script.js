const form = document.getElementById('surveyForm');
const q1Radios = form.q1;
const q2Container = document.querySelector('.q2');
const q2Select = document.getElementById('q2');
const q2Other = document.getElementById('q2_other');
const successMsg = document.getElementById('successMsg');

// แสดง q2 เฉพาะเวลาพอใจน้อย
form.q1.forEach(radio => {
  radio.addEventListener('change', () => {
    const val = parseInt(radio.value);
    if (val <= 2) {
      q2Container.classList.remove('hidden');
    } else {
      q2Container.classList.add('hidden');
      q2Select.value = "ไม่มี";
      q2Other.value = "";
      q2Other.classList.add('hidden');
    }
  });
});

// แสดงช่องอื่นๆ
q2Select.addEventListener('change', function(){
  if (this.value === "อื่นๆ") {
    q2Other.classList.remove('hidden');
    q2Other.required = true;
  } else {
    q2Other.classList.add('hidden');
    q2Other.required = false;
  }
});

// ส่งฟอร์ม
form.addEventListener('submit', async function(e){
  e.preventDefault();

  let q2Value = q2Select.value;
  if(q2Value === "อื่นๆ") q2Value = q2Other.value;

  const data = {
    q1: form.q1.value,
    q2: q2Value,
    q3: form.q3.value
  };

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });

    const res = await response.json();
    if(res.status === "success") {
      successMsg.classList.remove('hidden');
      form.reset();
      q2Container.classList.add('hidden');
      q2Other.classList.add('hidden');
    } else {
      alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
    }
  } catch(err) {
    console.error(err);
    alert("เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่");
  }
});
