// FILE: assets/js/pages/about.js

export const initAbout = () => {
  initCounterAnimation();
  initTeamSection();
};

const initCounterAnimation = () => {
  const counters = document.querySelectorAll(".counter");

  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
};

const initTeamSection = () => {
  const teamCards = document.querySelectorAll(".team-card");

  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hover");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hover");
    });
  });
};
