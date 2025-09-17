// script.js — improved UX: loading state + spinner + toast + reset
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const q2Select = document.getElementById('q2');
  const q2Other = document.getElementById('q2_other');
  const submitBtn = document.getElementById('submitBtn') || document.querySelector('button[type="submit"]');

  // --- helper: create toast container if not exist ---
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    // minimal styles (you can move to CSS)
    toastContainer.style.position = 'fixed';
    toastContainer.style.right = '16px';
    toastContainer.style.top = '16px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // --- show toast ---
  function showToast(message, { type = 'info', duration = 3000 } = {}) {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.textContent = message;
    // inline style for quick demo (move to CSS if preferred)
    t.style.marginTop = '8px';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '10px';
    t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    t.style.background = (type === 'success') ? '#0ea5e9' : (type === 'error' ? '#ef4444' : '#111827');
    t.style.color = '#fff';
    t.style.opacity = '0';
    t.style.transform = 'translateY(-8px)';
    t.style.transition = 'opacity .25s ease, transform .25s ease';
    toastContainer.appendChild(t);
    // force reflow then show
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      // hide then remove
      t.style.opacity = '0';
      t.style.transform = 'translateY(-8px)';
      setTimeout(() => t.remove(), 300);
    }, duration);
  }

  // --- spinner element factory ---
  function createSpinner() {
    const s = document.createElement('span');
    s.className = 'btn-spinner';
    s.style.display = 'inline-block';
    s.style.width = '18px';
    s.style.height = '18px';
    s.style.border = '2px solid rgba(255,255,255,0.6)';
    s.style.borderTopColor = 'white';
    s.style.borderRadius = '50%';
    s.style.marginRight = '8px';
    s.style.verticalAlign = 'middle';
    s.style.animation = 'spin 0.8s linear infinite';
    // add keyframes (only once)
    if (!document.getElementById('spinner-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spinner-keyframes';
      style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(style);
    }
    return s;
  }

  // --- show loading on button ---
  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.dataset.oldText = submitBtn.innerHTML;
      // clear and add spinner + text
      submitBtn.innerHTML = '';
      const spinner = createSpinner();
      spinner.id = 'current-spinner';
      submitBtn.appendChild(spinner);
      const txt = document.createElement('span');
      txt.textContent = 'กำลังบันทึก...';
      submitBtn.appendChild(txt);
      submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
    } else {
      // restore
      submitBtn.disabled = false;
      const old = submitBtn.dataset.oldText;
      if (old) submitBtn.innerHTML = old;
      submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
    }
  }

  // --- q2 other handling ---
  q2Select.addEventListener('change', () => {
    if (q2Select.value === 'อื่นๆ') {
      q2Other.classList.remove('hidden');
      q2Other.required = true;
      q2Other.focus();
    } else {
      q2Other.classList.add('hidden');
      q2Other.required = false;
    }
  });

  // --- active state reset helper (if you have q1Options) ---
  const q1Options = document.querySelectorAll('.emoji-option input');
  function resetQ1Active() {
    q1Options.forEach(i => {
      const box = i.parentElement.querySelector('div');
      if (box) box.classList.remove('border-blue-700', 'shadow-lg');
    });
  }

  // --- main submit ---
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    // quick validation for q1
    const selectedQ1 = Array.from(q1Options).find(r => r.checked);
    if (!selectedQ1) {
      showToast('กรุณาเลือกระดับความพึงพอใจ', { type: 'error', duration: 2500 });
      return;
    }

    // prepare values
    let q2Value = q2Select.value;
    if (q2Value === 'อื่นๆ') q2Value = q2Other.value.trim();

    // set loading state immediately (good UX)
    setLoading(true);
    showToast('กำลังส่งข้อมูล...'); // non-blocking

    const payload = new URLSearchParams();
    payload.append('q1', selectedQ1.value);
    payload.append('q2', q2Value);
    payload.append('q3', form.q3.value.trim());

    try {
      const resp = await fetch('Yhttps://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', { method: 'POST', body: payload });
      // handle non-JSON or network error
      const text = await resp.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Response ไม่อยู่ในรูปแบบ JSON: ' + text);
      }

      if (result.status === 'success') {
        // success UX: strong toast + small check animation
        showToast('บันทึกข้อมูลเรียบร้อย ✓', { type: 'success', duration: 2200 });

        // visual success on button (temporary)
        if (submitBtn) {
          submitBtn.innerHTML = 'บันทึกแล้ว ✓';
        }

        // reset form for next input after short delay so user sees success
        setTimeout(() => {
          form.reset();
          resetQ1Active();
          q2Other.classList.add('hidden');
          q2Other.required = false;
          // restore button text
          setLoading(false);
        }, 800);
      } else {
        // server returned an error JSON
        showToast('เกิดข้อผิดพลาด: ' + (result.message || 'ไม่ทราบสาเหตุ'), { type: 'error', duration: 4000 });
        setLoading(false);
      }
    } catch (err) {
      console.error('submit error:', err);
      showToast('ไม่สามารถบันทึกได้ กรุณาลองใหม่', { type: 'error', duration: 4000 });
      setLoading(false);
    }
  });
});
