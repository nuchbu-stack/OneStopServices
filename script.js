const options = document.querySelectorAll(".option");
const q1Input = document.getElementById("q1");
const q2Container = document.getElementById("q2Container");
const q2OtherCheck = document.getElementById("q2OtherCheck");
const q2Other = document.getElementById("q2Other");
const form = document.getElementById("surveyForm");
const message = document.getElementById("message");

// เลือกระดับความพึงพอใจ
options.forEach(opt => {
  opt.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Input.value = opt.dataset.value;

    // conditional show q2
    if (parseInt(opt.dataset.value) <= 2) {
      q2Container.style.display = "block";
    } else {
      q2Container.style.display = "none";
      // reset q2
      q2Container.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);
      q2Other.value = "";
      q2Other.style.display = "none";
    }
  });
});

// q2 Other text toggle
q2OtherCheck.addEventListener("change", ()=>{
  q2Other.style.display = q2OtherCheck.checked ? "inline-block" : "none";
});

// submit form
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const q2Values = Array.from(form.querySelectorAll('input[name="q2"]:checked'))
                    .map(c => c.value)
                    .join(", ");
  if(q2OtherCheck.checked && q2Other.value.trim()!="") {
    if(q2Values) q2Values+=", ";
    q2Values+=", "+q2Other.value.trim();
  }
  const data = {
    q1:q1Input.value,
    q2:q2Values,
    q3:document.getElementById("q3").value
  };
  try{
    // เคลียร์แคชด้วย timestamp
    const res = await fetch("https://script.google.com/macros/s/AKfycbyRW0AhfShKzeDS3NuLtNWtMzNIUNFdKb7FiIPs8yuozI-yjhtn5zQKRJnQ1rQ4SkVe/exec?cachebust="+Date.now(),{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });
    const result = await res.json();
    if(result.status==="success"){
      message.style.display="block";
      message.style.color="green";
      message.innerText="บันทึกข้อมูลเรียบร้อย ขอบคุณที่ตอบแบบสอบถาม";
      form.reset();
      options.forEach(o=>o.classList.remove("active"));
      q2Container.style.display="none";
      q2Other.style.display="none";
    }else{
      throw new Error(result.message);
    }
  }catch(err){
    message.style.display="block";
    message.style.color="red";
    message.innerText="เกิดข้อผิดพลาดขณะบันทึก กรุณาลองใหม่";
    console.error(err);
  }
});
