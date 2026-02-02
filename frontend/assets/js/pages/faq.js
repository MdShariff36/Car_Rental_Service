// FILE: assets/js/pages/faq.js

document.addEventListener("DOMContentLoaded", async function () {
  const faqContainer = document.getElementById("faqContainer");
  const searchInput = document.getElementById("faqSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  let allFaqs = [];

  await loadFaqs();

  if (searchInput) {
    searchInput.addEventListener("input", filterFaqs);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterFaqs);
  }

  async function loadFaqs() {
    showLoader();

    try {
      const response = await fetch("http://localhost:8080/api/faq", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load FAQs");
      }

      allFaqs = await response.json();
      displayFaqs(allFaqs);
    } catch (error) {
      console.error("Load FAQs error:", error);
      showNotification("Failed to load FAQs", "error");
    } finally {
      hideLoader();
    }
  }

  function displayFaqs(faqs) {
    if (!faqContainer) return;

    if (!faqs || faqs.length === 0) {
      faqContainer.innerHTML = '<p class="empty-message">No FAQs found</p>';
      return;
    }

    faqContainer.innerHTML = faqs
      .map(
        (faq, index) => `
            <div class="faq-item">
                <div class="faq-question" data-index="${index}">
                    <h3>${faq.question}</h3>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `,
      )
      .join("");

    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".faq-question").forEach((question) => {
      question.addEventListener("click", function () {
        const answer = this.nextElementSibling;
        const toggle = this.querySelector(".faq-toggle");

        // Toggle current FAQ
        const isOpen = answer.classList.contains("open");

        // Close all FAQs
        document
          .querySelectorAll(".faq-answer")
          .forEach((a) => a.classList.remove("open"));
        document
          .querySelectorAll(".faq-toggle")
          .forEach((t) => (t.textContent = "+"));

        // Open clicked FAQ if it was closed
        if (!isOpen) {
          answer.classList.add("open");
          toggle.textContent = "-";
        }
      });
    });
  }

  function filterFaqs() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "";

    const filtered = allFaqs.filter((faq) => {
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm);

      const matchesCategory = !category || faq.category === category;

      return matchesSearch && matchesCategory;
    });

    displayFaqs(filtered);
  }

  function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "flex";
  }

  function hideLoader() {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "none";
  }

  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});
