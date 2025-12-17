// assets/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Auto Prime Frontend Loaded");

  // Simple mobile nav toggle (future use)
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.querySelector(".nav").classList.toggle("open");
    });
  }
});
const bookedDates = ["2025-06-15", "2025-06-16"];

function isAvailable(date) {
  return !bookedDates.includes(date);
}
