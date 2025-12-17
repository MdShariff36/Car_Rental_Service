function calculateBill() {
  const start = new Date(document.getElementById("start").value);
  const end = new Date(document.getElementById("end").value);
  const price = 3500; // example

  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    alert("Invalid date selection");
    return;
  }

  const total = days * price;
  document.getElementById("total").innerText = "₹" + total;
}
