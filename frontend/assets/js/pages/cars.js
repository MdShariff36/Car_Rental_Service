fetch("http://localhost:8080/api/cars")
  .then((response) => response.json())
  .then((cars) => {
    const carList = document.getElementById("carList");

    carList.innerHTML = ""; // clear old content

    cars.forEach((car) => {
      const carDiv = document.createElement("div");
      carDiv.style.border = "1px solid #ccc";
      carDiv.style.padding = "10px";
      carDiv.style.margin = "10px 0";

      carDiv.innerHTML = `
        <h3>${car.name}</h3>
        <p>Brand: ${car.brand}</p>
        <p>Price per day: ₹${car.pricePerDay}</p>
      `;

      carList.appendChild(carDiv);
    });
  })
  .catch((error) => {
    console.error("Error loading cars:", error);
  });
