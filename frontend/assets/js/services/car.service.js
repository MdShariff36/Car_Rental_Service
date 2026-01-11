export const CarService = {
  getAll() {
    return [
      { id: 1, name: "Hyundai Creta", price: 3500 },
      { id: 2, name: "Maruti Swift", price: 1500 },
    ];
  },

  getById(id) {
    return this.getAll().find((c) => c.id == id);
  },
};
