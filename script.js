// script.js (minimal improved UX)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const q2Select = document.getElementById('q2');
  const q2Other = document.getElementById('q2_other');
  const submitBtn = document.getElementById('submitBtn');

  // toast container
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.right = '16px';
    toastContainer.style.top = '16px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  function showToast(text, color = '#111827', ms = 2500) {
    const t = document.createElement('div');
    t.textContent = text;
    t.style.padding = '8px 12px';
    t.style.borderRadius = '8px';
    t.style.background = color;
    t.style.color = '#fff';
    t.style.marginTop = '8px';
    t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    t.style.opacity = '0';
    t.style.transition = 'opacity .2s, transform .2s';
    toastContainer.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 200); }, ms);
  }

  // spinner helper
  function setLoading(on) {
    if (!submitBtn) return;
    if (on) {
      submitBtn.disabled = true;
      submitBtn.dataset.text = submitBtn.textContent;
      submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.6);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;margin-right:8px;vertical-align:middle;"></span>กำลังบันทึก...';
      if (!document.getElementById('spinstyle')) {
        const s = document.createElement('style'); s.id = 'spinstyle';
        s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
      }
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.text || 'ส่งแบบประเมิน';
    }
  }

  // q2 other toggle
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

  // submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const q1radio = form.querySelector('input[name="q1"]:checked');
    if (!q1radio) {
      showToast('กรุณาเลือกระดับความพึงพอใจ', '#ef4444', 2200);
      return;
    }

    let q2Val = q2Select.value;
    if (q2Val === 'อื่นๆ') q2Val = q2Other.value.trim();

    // start loading UX
    setLoading(true);
    showToast('กำลังส่งข้อมูล...');

    const payload = new URLSearchParams({
      q1: q1radio.value,
      q2: q2Val,
      q3: form.q3.value.trim()
    });

    try {
      const resp = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', { method: 'POST', body: payload });
      const text = await resp.text();
      let result;
      try { result = JSON.parse(text); } catch(err) {
        throw new Error('Response ไม่ใช่ JSON: ' + text);
      }

      if (result.status === 'success') {
        showToast('บันทึกข้อมูลเรียบร้อย', '#0ea5e9', 2000);
        // reset and ready for new input
        setTimeout(() => {
          form.reset();
          q2Other.classList.add('hidden');
          q2Other.required = false;
          setLoading(false);
        }, 700);
      } else {
        showToast('เกิดข้อผิดพลาด: ' + (result.message || ''), '#ef4444', 3500);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      showToast('ไม่สามารถบันทึกข้อมูล กรุณาลองใหม่', '#ef4444', 3500);
      setLoading(false);
    }
  });
});
