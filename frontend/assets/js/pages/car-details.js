import { getCar } from "../services/car.service.js";
const id = new URLSearchParams(location.search).get("id");
if (id) getCar(id).then(console.log);
