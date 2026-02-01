// FILE: assets/js/pages/faq.js

export const initFAQ = () => {
  setupAccordion();
  setupSearch();
};

const setupAccordion = () => {
  const accordionItems = document.querySelectorAll(".faq-item");

  accordionItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question?.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      accordionItems.forEach((i) => {
        i.classList.remove("active");
        const a = i.querySelector(".faq-answer");
        if (a) a.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }
    });
  });

  if (accordionItems.length > 0) {
    accordionItems[0].querySelector(".faq-question")?.click();
  }
};

const setupSearch = () => {
  const searchInput = document.querySelector("#faq-search");
  const faqItems = document.querySelectorAll(".faq-item");

  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    faqItems.forEach((item) => {
      const question =
        item.querySelector(".faq-question")?.textContent.toLowerCase() || "";
      const answer =
        item.querySelector(".faq-answer")?.textContent.toLowerCase() || "";

      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
};
