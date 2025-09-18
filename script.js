const form = document.getElementById('surveyForm');
const q1Options = document.querySelectorAll('#q1-options .option');
const q2Block = document.getElementById('q2-block');
const q2Options = document.querySelectorAll('#q2-options .option');
const q2OtherText = document.getElementById('q2-other-text');
const confirmation = document.getElementById('confirmation');

let selectedQ1 = null;
let selectedQ2 = null;

// Q1 selection
q1Options.forEach(opt => {
  opt.addEventListener('click', () => {
    q1Options.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selectedQ1 = opt.dataset.value;

    // Conditional Question
    if (selectedQ1 === "1" || selectedQ1 === "2") {
      q2Block.classList.remove('hidden');
    } else {
      q2Block.classList.add('hidden');
      q2Options.forEach(o => o.classList.remove('active'));
      q2OtherText.value = '';
      q2OtherText.classList.add('hidden');
      selectedQ2 = null;
    }
  });
});

// Q2 selection
q2Options.forEach(opt => {
  opt.addEventListener('click', () => {
    q2Options.forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    selectedQ2 = opt.dataset.value;

    if (opt.id === 'q2-other') {
      q2OtherText.classList.remove('hidden');
      q2OtherText.focus();
    } else {
      q2OtherText.classList.add('hidden');
      q2OtherText.value = '';
    }
  });
});

// Submit
form.addEventListener('submit', async e => {
  e.preventDefault();
  const q3 = document.getElementById('q3').value;

  let q2Value = selectedQ2;
  if (selectedQ2 === 'อื่นๆ') {
    q2Value = q2OtherText.value;
  }

  const payload = new URLSearchParams();
  payload.append('q1', selectedQ1 || '');
  payload.append('q2', q2Value || '');
  payload.append('q3', q3 || '');
  payload.append('cachebust', Date.now());

  try {
    await fetch('https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec', {
      method: 'POST',
      body: payload,
      mode: 'no-cors'
    });

    // Show confirmation & reset
    confirmation.classList.remove('hidden');
    setTimeout(() => confirmation.classList.add('hidden'), 3000);

    form.reset();
    q1Options.forEach(o => o.classList.remove('active'));
    q2Block.classList.add('hidden');
    q2Options.forEach(o => o.classList.remove('active'));
    q2OtherText.classList.add('hidden');
    selectedQ1 = selectedQ2 = null;

  } catch (err) {
    alert('เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่');
    console.error(err);
  }
});
