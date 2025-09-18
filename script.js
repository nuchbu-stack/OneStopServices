// แสดงช่อง "อื่นๆ" ถ้าเลือก
const q2Select = document.getElementById('q2');
const q2Other = document.getElementById('q2_other');

q2Select.addEventListener('change', () => {
  if (q2Select.value === 'อื่นๆ') {
    q2Other.classList.remove('hidden');
    q2Other.required = true;
  } else {
    q2Other.classList.add('hidden');
    q2Other.required = false;
  }
});

// ซ่อนคำถามไม่พึงพอใจถ้าเลือกระดับความพึงพอใจสูง
const q1Radios = document.querySelectorAll('input[name="q1"]');
const q2Container = document.getElementById('q2-container');

q1Radios.forEach(radio => {
  radio.addEventListener('change', () => {
    const val = parseInt(radio.value);
    if (val <= 2) {
      q2Container.classList.remove('hidden');
    } else {
      q2Container.classList.add('hidden');
      q2Select.value = 'ไม่มี';
      q2Other.value = '';
      q2Other.classList.add('hidden');
    }
  });
});

// ส่งฟอร์ม
const form = document.getElementById('surveyForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  let q2Value = q2Select.value;
  if (q2Value === 'อื่นๆ') q2Value = q2Other.value;

  const data = {
    q1: document.querySelector('input[name="q1"]:checked')?.value || '',
    q2: q2Value,
    q3: document.getElementById('q3').value || ''
  };

  try {
    const resp = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data)
    });
    const json = await resp.json();
    if (json.status === 'success') {
      successMsg.classList.remove('hidden');
      form.reset();
      q2Container.classList.add('hidden');
      q2Other.classList.add('hidden');
      setTimeout(() => successMsg.classList.add('hidden'), 3000);
    } else {
      alert('เกิดข้อผิดพลาดขณะบันทึก: ' + json.message);
    }
  } catch(err) {
    alert('เกิดข้อผิดพลาดขณะบันทึก: ' + err);
  }
});