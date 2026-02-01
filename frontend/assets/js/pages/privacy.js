// FILE: assets/js/pages/privacy.js

export const initPrivacy = () => {
  setupTableOfContents();
  setupPrintButton();
  highlightSection();
};

const setupTableOfContents = () => {
  const toc = document.querySelector("#table-of-contents");
  const sections = document.querySelectorAll(".privacy-section");

  if (!toc || sections.length === 0) return;

  const tocList = document.createElement("ul");
  tocList.className = "toc-list";

  sections.forEach((section, index) => {
    const heading = section.querySelector("h2");
    if (!heading) return;

    const id = `section-${index + 1}`;
    section.id = id;

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading.textContent;
    li.appendChild(link);
    tocList.appendChild(li);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth" });
    });
  });

  toc.appendChild(tocList);
};

const setupPrintButton = () => {
  const printBtn = document.querySelector("#print-privacy");

  printBtn?.addEventListener("click", () => {
    window.print();
  });
};

const highlightSection = () => {
  const hash = window.location.hash;
  if (!hash) return;

  const section = document.querySelector(hash);
  if (section) {
    section.classList.add("highlighted");
    setTimeout(() => section.classList.remove("highlighted"), 2000);
  }
};
