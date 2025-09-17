// script.js — active animation, keyboard support, UX (spinner, toast), submit (URL-encoded)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const submitBtn = document.getElementById('submitBtn');
  const q2Select = document.getElementById('q2');
  const q2Other = document.getElementById('q2_other');
  const successMsg = document.getElementById('successMsg');
  const emojiLabels = document.querySelectorAll('.emoji-option');

  // create toast container
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '16px';
    toastContainer.style.right = '16px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }

  // toast helper
  function showToast(text, bg = '#111827', duration = 2500) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    t.style.background = bg;
    t.style.opacity = '0';
    t.style.transform = 'translateY(-8px)';
    t.style.transition = 'opacity .2s, transform .2s';
    toastContainer.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-8px)';
      setTimeout(() => t.remove(), 220);
    }, duration);
  }

  // spinner helper for button
  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.dataset.oldHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.6);border-top-color:#fff;border-radius:50%;margin-right:8px;vertical-align:middle;animation:spin .8s linear infinite;"></span>กำลังบันทึก...';
      if (!document.getElementById('spinstyle')) {
        const s = document.createElement('style');
        s.id = 'spinstyle';
        s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(s);
      }
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtn.dataset.oldHtml || 'ส่งแบบประเมิน';
    }
  }

  // --- Active state & keyboard support ---
  emojiLabels.forEach(label => {
    // find radio input inside label
    const input = label.querySelector('input[type="radio"]');
    const box = label.querySelector('.emoji-box');

    // ensure label focusable (we set tabindex in HTML)
    label.addEventListener('click', (e) => {
      // clicking the label will toggle input by browser, but ensure class set after short delay
      setTimeout(() => setActive(label), 10);
    });

    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (input) input.checked = true;
        setActive(label);
      }
    });

    if (input) {
      input.addEventListener('change', () => setActive(label));
    }
  });

  function setActive(selectedLabel) {
    emojiLabels.forEach(l => {
      const box = l.querySelector('.emoji-box');
      if (l === selectedLabel) box.classList.add('emoji-active');
      else box.classList.remove('emoji-active');
    });
  }

  // initialize active if default checked
  (function initActive() {
    const checked = document.querySelector('.emoji-option input[type="radio"]:checked');
    if (checked) {
      const label = checked.closest('.emoji-option');
      if (label) setActive(label);
    }
  })();

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

  // --- Submit handler ---
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    // quick validation: q1 selected
    const selectedQ1 = form.querySelector('input[name="q1"]:checked');
    if (!selectedQ1) {
      showToast('กรุณาเลือกระดับความพึงพอใจ', '#ef4444', 2200);
      return;
    }

    // prepare q2 value
    let q2Val = q2Select.value;
    if (q2Val === 'อื่นๆ') q2Val = q2Other.value.trim();

    // prepare URLSearchParams (form-urlencoded)
    const payload = new URLSearchParams();
    payload.append('q1', selectedQ1.value);
    payload.append('q2', q2Val);
    payload.append('q3', form.q3.value.trim());

    // UX: show loading immediately
    setLoading(true);
    showToast('กำลังส่งข้อมูล...', '#111827', 1500);

    try {
      // <-- UPDATE: set YOUR_WEB_APP_URL below -->
      const response = await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
        method: 'POST',
        body: payload
      });

      // handle response (server returns JSON)
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        throw new Error('Response ไม่เป็น JSON: ' + text);
      }

      if (result.status === 'success') {
        // success UX
        showToast('บันทึกข้อมูลเรียบร้อย ✓', '#0ea5e9', 2000);
        successMsg.classList.remove('hidden');

        // reset form after short delay so user sees success
        setTimeout(() => {
          form.reset();
          // reset active states
          document.querySelectorAll('.emoji-box').forEach(b => b.classList.remove('emoji-active'));
          q2Other.classList.add('hidden');
          q2Other.required = false;
          successMsg.classList.add('hidden');
          setLoading(false);
        }, 800);
      } else {
        showToast('เกิดข้อผิดพลาด: ' + (result.message || ''), '#ef4444', 3500);
        setLoading(false);
      }
    } catch (err) {
      console.error('submit error:', err);
      showToast('ไม่สามารถบันทึกข้อมูล กรุณาลองใหม่', '#ef4444', 3500);
      setLoading(false);
    }
  });
});
