const cars = [
  {
    name: "Hyundai Creta",
    image: "assets/images/car-images/Hyundai Creta/Hyundai Creta.jfif",
    type: "SUV",
    transmission: "Automatic",
    seats: "5 Seats",
    price: "₹3,500/day",
    link: "car-details.html?car=creta",
  },
  {
    name: "Toyota Innova",
    image: "assets/images/car-images/Toyota innova/Toyota innova.jfif",
    type: "MPV",
    transmission: "Manual",
    seats: "7 Seats",
    price: "₹4,200/day",
    link: "car-details.html?car=innova",
  },
  {
    name: "Maruti Swift",
    image: "assets/images/car-images/Maruti Swift/Maruti Swift.jfif",
    type: "Hatchback",
    transmission: "Manual",
    seats: "5 Seats",
    price: "₹1,500/day",
    link: "car-details.html?car=swift",
  },
  {
    name: "Hyundai i20",
    image: "assets/images/car-images/Hyundai i20/Hyundai i20.jfif",
    type: "Hatchback",
    transmission: "Automatic",
    seats: "5 Seats",
    price: "₹1,800/day",
    link: "car-details.html?car=i20",
  },
  {
    name: "Mahindra XUV700",
    image: "assets/images/car-images/Mahindra XUV700/Mahindra XUV700.jfif",
    type: "SUV",
    transmission: "Automatic",
    seats: "7 Seats",
    price: "₹4,000/day",
    link: "car-details.html?car=xuv700",
  },
  {
    name: "Tata Nexon",
    image: "assets/images/car-images/Tata Nexon/Tata Nexon.jfif",
    type: "SUV",
    transmission: "Manual",
    seats: "5 Seats",
    price: "₹2,500/day",
    link: "car-details.html?car=nexon",
  },
];

const carGrid = document.getElementById("carGrid");

cars.forEach((car) => {
  carGrid.innerHTML += `
    <div class="car-card">
      <img src="${car.image}" alt="${car.name}">
      <div class="car-info">
        <h3>${car.name}</h3>
        <div class="car-tags">
          <span>${car.type}</span>
          <span>${car.transmission}</span>
          <span>${car.seats}</span>
        </div>
        <div class="car-price">${car.price}</div>
        <a href="${car.link}" class="btn">Book Now</a>
      </div>
    </div>
  `;
});
