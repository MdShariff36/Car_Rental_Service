export const loadFooter = async () => {
  const el = document.querySelector("footer");
  if (!el) return;
  try {
    const html = await fetch("/components/footer.html").then((r) => r.text());
    el.innerHTML = html;
  } catch (err) {
    console.error("Failed to load footer:", err);
  }
};
