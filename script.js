const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec'; // ใส่ URL Apps Script
const form = document.getElementById('surveyForm');
const successMsg = document.getElementById('successMsg');
const q2Div = document.getElementById('q2Div');
const q2Select = document.getElementById('q2');
const q2Other = document.getElementById('q2_other');

q2Div.style.display = 'none';
q2Other.style.display = 'none';

q2Select.addEventListener('change', () => {
  if (q2Select.value === 'อื่นๆ') {
    q2Other.style.display = 'block';
    q2Other.required = true;
  } else {
    q2Other.style.display = 'none';
    q2Other.required = false;
  }
});

// แสดงคำถามไม่พึงพอใจเฉพาะเมื่อเลือก 1 หรือ 2
document.querySelectorAll('input[name="q1"]').forEach(input => {
  input.addEventListener('change', () => {
    const value = parseInt(input.value);
    if (value <= 2) {
      q2Div.style.display = 'block';
    } else {
      q2Div.style.display = 'none';
      q2Select.value = 'ไม่มี';
      q2Other.value = '';
      q2Other.style.display = 'none';
    }
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(form);

  // ถ้าเลือกอื่นๆ ให้เอา value จาก input
  if (formData.get('q2') === 'อื่นๆ') {
    formData.set('q2', q2Other.value);
  }

  fetch(WEB_APP_URL, {
    method: 'POST',
    body: formData
  }).then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
          form.reset();
          q2Div.style.display = 'none';
          q2Other.style.display = 'none';
        }, 1500);
      } else {
        alert('เกิดข้อผิดพลาดขณะบันทึก');
      }
    })
    .catch(err => alert('เกิดข้อผิดพลาดขณะบันทึก'));
});
