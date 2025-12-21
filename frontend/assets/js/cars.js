document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/auto-prime-rental/api/cars")
    .then((res) => res.json())
    .then((cars) => {
      const container = document.getElementById("carList");
      container.innerHTML = "";

      cars.forEach((car) => {
        container.innerHTML += `
          <article class="car-card">
            <h3>${car.name}</h3>
            <p>${car.type} • ${car.transmission}</p>
            <p class="price">₹${car.price}/day</p>
            <a href="booking.html?carId=${car.id}" class="btn btn-sm">Book</a>
          </article>
        `;
      });
    });
});
