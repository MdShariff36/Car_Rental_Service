function loginUser() {
  localStorage.setItem("user", "loggedIn");
  alert("Login successful");
  window.location.href = "user/dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
