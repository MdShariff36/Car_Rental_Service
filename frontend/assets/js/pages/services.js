// FILE: assets/js/pages/services.js

export const initServices = () => {
  initServiceCards();
  initPricingPlans();
};

const initServiceCards = () => {
  const cards = document.querySelectorAll(".service-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  cards.forEach((card) => observer.observe(card));
};

const initPricingPlans = () => {
  const planButtons = document.querySelectorAll(".pricing-plan .btn");

  planButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const plan = button
        .closest(".pricing-plan")
        .querySelector("h3")?.textContent;
      alert(`You selected the ${plan} plan. Redirecting to registration...`);
      window.location.href = "/register";
    });
  });
};
