export const showModal = (title, message) => {
  const modal = document.getElementById("modal");
  if(!modal) return;
  modal.querySelector(".modal-title").textContent = title;
  modal.querySelector(".modal-body").textContent = message;
  modal.style.display = "block";
};

export const closeModal = () => {
  document.getElementById("modal")?.style.display = "none";
};
