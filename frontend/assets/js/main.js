import { loadHeader } from "./components/header.js";
import { loadFooter } from "./components/footer.js";
import { initRouter } from "./core/router.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadFooter();
  await initRouter();
});
