// FILE: assets/js/ui/loader.js

let loaderCount = 0;

export const showLoader = () => {
  loaderCount++;

  let loader = document.querySelector("#global-loader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "global-loader";
    loader.className = "loader-overlay";
    loader.innerHTML = `
      <div class="loader-spinner">
        <div class="spinner"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  loader.style.display = "flex";
};

export const hideLoader = () => {
  loaderCount = Math.max(0, loaderCount - 1);

  if (loaderCount === 0) {
    const loader = document.querySelector("#global-loader");
    if (loader) {
      loader.style.display = "none";
    }
  }
};

export const resetLoader = () => {
  loaderCount = 0;
  const loader = document.querySelector("#global-loader");
  if (loader) {
    loader.style.display = "none";
  }
};
