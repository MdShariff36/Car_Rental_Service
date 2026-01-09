function loadComponent(id, file) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    })
    .catch((err) => console.error("Component load error:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    loadComponent("header", "components/header.html");
  }

  if (document.getElementById("footer")) {
    loadComponent("footer", "components/footer.html");
  }
});
