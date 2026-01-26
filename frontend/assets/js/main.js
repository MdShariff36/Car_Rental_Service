import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Auto Prime App Initializing...");

  // Load header and footer
  await loadHeader();
  await loadFooter();

  // Initialize page-specific scripts based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  console.log(`📄 Current page: ${currentPage}`);

  // Dynamic page initialization
  try {
    if (currentPage === "index.html" || currentPage === "") {
      const homeModule = await import("./pages/home.js");
      homeModule.init?.();
    } else if (currentPage === "cars.html") {
      // Cars page initializes itself via DOMContentLoaded
    } else if (currentPage === "register.html") {
      // Register page initializes itself
    } else if (currentPage === "login.html") {
      // Login page initializes itself
    }
  } catch (error) {
    console.error("Error initializing page:", error);
  }

  console.log("✅ App Initialized");
});
