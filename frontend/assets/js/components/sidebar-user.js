export const loadSidebarUser = async () => {
  const el = document.getElementById("sidebar");
  if (!el) return;
  try {
    const html = await fetch("/components/sidebar-user.html").then((r) =>
      r.text()
    );
    el.innerHTML = html;
  } catch (err) {
    console.error("Failed to load sidebar:", err);
  }
};
