document.addEventListener('DOMContentLoaded', () => {
  const emojiLabels = document.querySelectorAll('.emoji-option');
  const form = document.getElementById('surveyForm');
  const successMsg = document.getElementById('successMsg');
  const q2Select = document.getElementById('q2');
  const q2Other = document.getElementById('q2_other');

  // --- Emoji active state ---
  emojiLabels.forEach(label => {
    const input = label.querySelector('input[type="radio"]');
    label.setAttribute('tabindex', '0');

    label.addEventListener('click', () => setActive(label));
    label.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.checked = true;
        setActive(label);
      }
    });
    input.addEventListener('change', () => setActive(label));
  });

  function setActive(selectedLabel) {
    emojiLabels.forEach(l => {
      const box = l.querySelector('div');
      if (l === selectedLabel) box.classList.add('emoji-active');
      else box.classList.remove('emoji-active');
    });
  }

  // --- Show/hide other input ---
  q2Select.addEventListener('change', () => {
    if (q2Select.value === 'อื่นๆ') {
      q2Other.classList.remove('hidden');
      q2Other.required = true;
    } else {
      q2Other.classList.add('hidden');
      q2Other.required = false;
    }
  });

  // --- Handle submit ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let q2Value = q2Select.value === 'อื่นๆ' ? q2Other.value : q2Select.value;
    const data = {
      q1: form.q1.value,
      q2: q2Value,
      q3: form.q3.value
    };

    try {
      const resp = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type':'application/json'}
      });
      const result = await resp.json();
      if (result.status === 'success') {
        successMsg.classList.remove('hidden');
        form.reset();
        emojiLabels.forEach(l => l.querySelector('div').classList.remove('emoji-active'));
        q2Other.classList.add('hidden');
        q2Other.required = false;
      } else {
        alert('เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่');
      console.error(err);
    }
  });
});
