async function loadComponent(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    loadComponent("header", "/components/header.html");
  }
  if (document.getElementById("footer")) {
    loadComponent("footer", "/components/footer.html");
  }
});
