export const loadHeader = async () => {
  const el = document.querySelector("header");
  if (!el) return;
  try {
    const html = await fetch("/components/header.html").then((r) => r.text());
    el.innerHTML = html;
  } catch (err) {
    console.error("Failed to load header:", err);
  }
};
