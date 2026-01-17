document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "components/header.html");
  loadHTML("footer", "components/footer.html");
});

function loadHTML(elementId, filePath) {
  const container = document.getElementById(elementId);
  if (!container) return;

  fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Cannot load " + filePath);
      }
      return response.text();
    })
    .then((html) => {
      container.innerHTML = html;
    })
    .catch((err) => console.error(err));
}
