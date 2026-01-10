const Loader = {
  show: () => {
    const loader = document.createElement("div");
    loader.id = "app-loader";
    loader.className = "loader-overlay";
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  },
  hide: () => {
    const loader = document.getElementById("app-loader");
    if (loader) loader.remove();
  },
};
