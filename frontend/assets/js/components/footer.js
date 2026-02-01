// FILE: assets/js/components/footer.js

export const initFooter = () => {
  setupNewsletterForm();
  setupScrollToTop();
  updateFooterYear();
};

const setupNewsletterForm = () => {
  const form = document.querySelector("#footer-newsletter-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const email = emailInput?.value;

    if (!email) return;

    const originalText = button?.textContent;
    if (button) button.textContent = "Subscribing...";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Thank you for subscribing to our newsletter!");
      form.reset();
    } catch (error) {
      alert("Failed to subscribe. Please try again.");
    } finally {
      if (button && originalText) {
        button.textContent = originalText;
      }
    }
  });
};

const setupScrollToTop = () => {
  const scrollBtn = document.querySelector(".scroll-to-top");

  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

const updateFooterYear = () => {
  const yearElement = document.querySelector(".footer-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};
