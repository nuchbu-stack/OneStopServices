document.addEventListener("DOMContentLoaded", function () {
  const options = document.querySelectorAll(".option");
  const q1Input = document.getElementById("q1");
  const q2Container = document.getElementById("q2-container");
  const form = document.getElementById("surveyForm");
  const confirmation = document.getElementById("confirmation");

  options.forEach(opt => {
    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      q1Input.value = opt.dataset.value;

      if (opt.dataset.value === "1" || opt.dataset.value === "2") {
        q2Container.classList.remove("hidden");
      } else {
        q2Container.classList.add("hidden");
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const iframe = document.querySelector("iframe[name='hidden_iframe']");
    const formEl = this;

    const resetForm = () => {
      formEl.reset();
      options.forEach(o => o.classList.remove("active"));
      q2Container.classList.add("hidden");
      q1Input.value = "";
    };

    confirmation.classList.remove("hidden");
    setTimeout(() => {
      confirmation.classList.add("hidden");
      resetForm();
    }, 2000);

    formEl.submit();
  });
});
