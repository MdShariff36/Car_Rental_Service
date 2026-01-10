import { login } from "../services/auth.service.js";

window.doLogin = async () => {
  await login({
    email: email.value,
    password: password.value,
  });
  location.href = "/dashboard.html";
};
