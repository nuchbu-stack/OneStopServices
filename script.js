// ⭐ เปลี่ยนเป็น URL ของ Google Apps Script Web App ของคุณ
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("surveyForm");
  const messageBox = document.getElementById("message");
  const dissatisfactionSection = document.getElementById("dissatisfactionSection");
  const ratingInputs = document.querySelectorAll("input[name='q1']");

  // เงื่อนไขโชว์คำถามไม่พึงพอใจ
  ratingInputs.forEach(input => {
    input.addEventListener("change", () => {
      if (input.value === "1" || input.value === "2") {
        dissatisfactionSection.classList.remove("hidden");
      } else {
        dissatisfactionSection.classList.add("hidden");
      }
    });
  });

  // ส่งข้อมูลไป Google Sheet
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // รวมค่า checkbox q2
    const q2Values = [];
    form.querySelectorAll("input[name='q2']:checked").forEach(cb => {
      q2Values.push(cb.value);
    });
    const other = form.querySelector("input[name='q2_other']").value;
    if (other) q2Values.push(other);

    const payload = {
      q1: formData.get("q1") || "",
      q2: q2Values.join(", "),
      q3: formData.get("q3") || ""
    };

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams(payload)
      });

      const result = await res.json();

      if (result.status === "success") {
        messageBox.textContent = "บันทึกข้อมูลเรียบร้อย ขอบคุณที่ตอบแบบสอบถาม 🙏";
        messageBox.className = "success";
        messageBox.classList.remove("hidden");
        form.reset();
        dissatisfactionSection.classList.add("hidden");
      } else {
        throw new Error(result.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      messageBox.textContent = "ไม่สามารถบันทึกข้อมูลได้ ❌";
      messageBox.className = "error";
      messageBox.classList.remove("hidden");
      console.error(err);
    }
  });
});
