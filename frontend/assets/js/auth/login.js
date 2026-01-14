import { login } from "../services/auth.service.js";
import { validateEmail, validatePassword } from "../base/validators.js";
import { showLoader, hideLoader } from "../ui/loader.js";

export const init = () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = data.get("email");
    const password = data.get("password");

    if (!validateEmail(email) || !validatePassword(password)) {
      alert("Invalid email or password");
      return;
    }

    showLoader();
    try {
      await login(email, password);
      window.location.href = "/index.html";
    } catch (err) {
      alert(err.message);
    } finally {
      hideLoader();
    }
  });
};
