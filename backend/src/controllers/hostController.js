const Car = require("../models/Car");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Payment = require("../models/Payment");
const { successResponse, errorResponse } = require("../utils/response");
const { sequelize } = require("../config/db");

const getHostDashboard = async (req, res) => {
  try {
    const hostId = req.user.id;

    const totalCars = await Car.count({ where: { hostId } });
    const activeCars = await Car.count({
      where: { hostId, status: "available" },
    });

    const cars = await Car.findAll({ where: { hostId } });
    const carIds = cars.map((car) => car.id);

    const activeBookings = await Booking.count({
      where: {
        carId: carIds,
        status: ["confirmed", "ongoing"],
      },
    });

    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: "booking",
          where: { carId: carIds },
          required: true,
        },
      ],
      where: { status: "completed" },
    });

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const recentBookings = await Booking.findAll({
      where: { carId: carIds },
      include: [
        {
          model: Car,
          as: "car",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    return successResponse(
      res,
      {
        totalCars,
        activeCars,
        activeBookings,
        totalEarnings: totalEarnings.toFixed(2),
        monthlyEarnings: monthlyEarnings.toFixed(2),
        recentBookings,
      },
      "Host dashboard data retrieved successfully",
    );
  } catch (error) {
    console.error("Get host dashboard error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getHostCars = async (req, res) => {
  try {
    const hostId = req.user.id;

    const cars = await Car.findAll({
      where: { hostId },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, cars, "Host cars retrieved successfully");
  } catch (error) {
    console.error("Get host cars error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const createHostCar = async (req, res) => {
  try {
    const hostId = req.user.id;
    const {
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
    } = req.body;

    if (!name || !pricePerDay) {
      return errorResponse(res, "Name and price per day are required", 400);
    }

    const car = await Car.create({
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
      hostId,
      status: "available",
    });

    return successResponse(res, car, "Car created successfully", 201);
  } catch (error) {
    console.error("Create host car error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getHostCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    const car = await Car.findOne({
      where: { id, hostId },
    });

    if (!car) {
      return errorResponse(res, "Car not found or unauthorized", 404);
    }

    return successResponse(res, car, "Car retrieved successfully");
  } catch (error) {
    console.error("Get host car by ID error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const updateHostCar = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    const car = await Car.findOne({
      where: { id, hostId },
    });

    if (!car) {
      return errorResponse(res, "Car not found or unauthorized", 404);
    }

    const {
      name,
      brand,
      model,
      category,
      year,
      seats,
      transmission,
      fuelType,
      luggage,
      pricePerDay,
      description,
      features,
      imageUrl,
      images,
      status,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (model !== undefined) updateData.model = model;
    if (category !== undefined) updateData.category = category;
    if (year !== undefined) updateData.year = year;
    if (seats !== undefined) updateData.seats = seats;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (luggage !== undefined) updateData.luggage = luggage;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (status !== undefined) updateData.status = status;

    await car.update(updateData);

    return successResponse(res, car, "Car updated successfully");
  } catch (error) {
    console.error("Update host car error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const deleteHostCar = async (req, res) => {
  try {
    const { id } = req.params;
    const hostId = req.user.id;

    const car = await Car.findOne({
      where: { id, hostId },
    });

    if (!car) {
      return errorResponse(res, "Car not found or unauthorized", 404);
    }

    const activeBookings = await Booking.count({
      where: {
        carId: id,
        status: ["confirmed", "ongoing"],
      },
    });

    if (activeBookings > 0) {
      return errorResponse(res, "Cannot delete car with active bookings", 400);
    }

    await car.destroy();

    return successResponse(res, null, "Car deleted successfully");
  } catch (error) {
    console.error("Delete host car error:", error);
    return errorResponse(res, error.message, 500);
  }
};

const getHostEarnings = async (req, res) => {
  try {
    const hostId = req.user.id;

    const cars = await Car.findAll({ where: { hostId } });
    const carIds = cars.map((car) => car.id);

    const payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: "booking",
          where: { carId: carIds },
          required: true,
          include: [
            {
              model: Car,
              as: "car",
            },
          ],
        },
      ],
      where: { status: "completed" },
      order: [["createdAt", "DESC"]],
    });

    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = payments
      .filter((p) => {
        const paymentDate = new Date(p.createdAt);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return successResponse(
      res,
      {
        total: total.toFixed(2),
        thisMonth: thisMonth.toFixed(2),
        bookingsCount: payments.length,
        earnings: payments.map((p) => ({
          id: p.id,
          amount: p.amount,
          date: p.createdAt,
          transactionId: p.transactionId,
          carName: p.booking?.car?.name,
          method: p.method,
        })),
      },
      "Earnings retrieved successfully",
    );
  } catch (error) {
    console.error("Get host earnings error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getHostDashboard,
  getHostCars,
  createHostCar,
  getHostCarById,
  updateHostCar,
  deleteHostCar,
  getHostEarnings,
};
