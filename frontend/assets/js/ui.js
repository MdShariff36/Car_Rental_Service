async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    loadComponent("header", "components/header.html");
  }

  if (document.getElementById("footer")) {
    loadComponent("footer", "components/footer.html");
  }
});
