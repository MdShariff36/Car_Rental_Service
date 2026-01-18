// FILE: assets/js/components/footer.js

export const loadFooter = async () => {
  // 1. Target by ID "footer" (works for both <div id="footer"> and <footer id="footer">)
  const footerPlaceholder = document.getElementById("footer");

  if (!footerPlaceholder) {
    console.warn("Footer placeholder not found");
    return;
  }

  // 2. Determine correct path (Handles subfolders like /user/ or /admin/)
  const isInSubFolder =
    window.location.pathname.includes("/user/") ||
    window.location.pathname.includes("/host/") ||
    window.location.pathname.includes("/admin/");

  const basePath = isInSubFolder ? "../" : "";
  const footerPath = `${basePath}components/footer.html`;

  try {
    // 3. Fetch the HTML
    const response = await fetch(footerPath);

    if (!response.ok) {
      throw new Error(`Could not load footer from ${footerPath}`);
    }

    const html = await response.text();

    // 4. Inject HTML
    footerPlaceholder.innerHTML = html;
  } catch (err) {
    console.error("Footer Error:", err);
    footerPlaceholder.innerHTML = `<div style="text-align:center; padding: 20px; color: red;">Failed to load footer</div>`;
  }
};
