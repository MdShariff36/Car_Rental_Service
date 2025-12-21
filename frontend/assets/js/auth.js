function login() {
  fetch("http://localhost:8080/auto-prime-rental/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((user) => {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "user/dashboard.html";
    });
}
