import { Storage } from "../base/storage.js";
import { CONFIG } from "../base/config.js";

fetch("/frontend/components/header.html")
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header").innerHTML = html;

    const authArea = document.getElementById("authArea");
    const user = Storage.get(CONFIG.STORAGE_KEYS.USER);

    if (user) {
      authArea.innerHTML = `
        <span>Hi, ${user.name}</span>
        <button id="logoutBtn" class="btn">Logout</button>
      `;

      document.getElementById("logoutBtn").onclick = () => {
        Storage.clear();
        window.location.href = "/frontend/index.html";
      };
    } else {
      authArea.innerHTML = `
        <a href="/frontend/login.html">Login</a>
      `;
    }
  });
