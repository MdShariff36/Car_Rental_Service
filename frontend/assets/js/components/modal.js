// FILE: assets/js/components/modal.js

class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.isOpen = false;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    const closeBtn = this.modal.querySelector("[data-modal-close]");
    const overlay = this.modal.querySelector(".modal-overlay");

    closeBtn?.addEventListener("click", () => this.close());
    overlay?.addEventListener("click", () => this.close());

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    if (!this.modal) return;

    this.modal.classList.add("show");
    document.body.style.overflow = "hidden";
    this.isOpen = true;

    this.modal.dispatchEvent(new CustomEvent("modal:opened"));
  }

  close() {
    if (!this.modal) return;

    this.modal.classList.remove("show");
    document.body.style.overflow = "";
    this.isOpen = false;

    this.modal.dispatchEvent(new CustomEvent("modal:closed"));
  }

  setContent(content) {
    const body = this.modal?.querySelector(".modal-body");
    if (body) {
      body.innerHTML = content;
    }
  }

  setTitle(title) {
    const header = this.modal?.querySelector(".modal-title");
    if (header) {
      header.textContent = title;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const createModal = (modalId) => {
  return new Modal(modalId);
};

export const showModal = (modalId) => {
  const modal = new Modal(modalId);
  modal.open();
  return modal;
};

export const closeModal = (modalId) => {
  const modal = new Modal(modalId);
  modal.close();
};

export const confirmModal = (message, title = "Confirm") => {
  return new Promise((resolve) => {
    const modalHTML = `
      <div class="modal" id="confirm-modal">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
          </div>
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-action="cancel">Cancel</button>
            <button class="btn btn-primary" data-action="confirm">Confirm</button>
          </div>
        </div>
      </div>
    `;

    const temp = document.createElement("div");
    temp.innerHTML = modalHTML;
    document.body.appendChild(temp.firstElementChild);

    const modal = new Modal("confirm-modal");
    modal.open();

    const confirmBtn = document.querySelector('[data-action="confirm"]');
    const cancelBtn = document.querySelector('[data-action="cancel"]');

    confirmBtn?.addEventListener("click", () => {
      modal.close();
      document.getElementById("confirm-modal")?.remove();
      resolve(true);
    });

    cancelBtn?.addEventListener("click", () => {
      modal.close();
      document.getElementById("confirm-modal")?.remove();
      resolve(false);
    });
  });
};
