// FILE: assets/js/components/header.js

export const loadHeader = async () => {
  // 1. Target the placeholder
  const headerPlaceholder =
    document.getElementById("header") || document.querySelector("header");
  if (!headerPlaceholder) return;

  // 2. Determine the correct path based on where the user is
  // If we are in a subfolder (like /user/, /host/, /admin/), go up one level ("../")
  const isInSubFolder =
    window.location.pathname.includes("/user/") ||
    window.location.pathname.includes("/host/") ||
    window.location.pathname.includes("/admin/");

  const basePath = isInSubFolder ? "../" : "";
  const headerPath = `${basePath}components/header.html`;

  try {
    // 3. Fetch the HTML
    const response = await fetch(headerPath);

    if (!response.ok) {
      throw new Error(`Could not load header from ${headerPath}`);
    }

    const html = await response.text();

    // 4. Inject HTML
    headerPlaceholder.innerHTML = html;

    // 5. Initialize the Sticky/Moveable Header Logic
    initStickyHeader();

    // 6. Highlight active link
    highlightActiveLink();
  } catch (err) {
    console.error("Header Error:", err);
    headerPlaceholder.innerHTML = `<div style="padding:20px; text-align:center; color:red;">Error loading header: ${err.message}</div>`;
  }
};

// --- Sticky Header Animation Logic ---
const initStickyHeader = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Listen for scroll events
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
};

// --- Active Link Highlighter ---
const highlightActiveLink = () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav a");

  links.forEach((link) => {
    // Check if the link href matches the current file name
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
};
