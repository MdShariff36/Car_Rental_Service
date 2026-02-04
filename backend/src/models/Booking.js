// ═══════════════════════════════════════════════════════════════
// BOOKING MODEL
// Database model for rental reservations
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cars",
        key: "id",
      },
    },
    pickupDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Invalid pickup date" },
        notEmpty: { msg: "Pickup date is required" },
      },
    },
    dropoffDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Invalid dropoff date" },
        notEmpty: { msg: "Dropoff date is required" },
        isAfterPickup(value) {
          if (
            value &&
            this.pickupDate &&
            new Date(value) <= new Date(this.pickupDate)
          ) {
            throw new Error("Dropoff date must be after pickup date");
          }
        },
      },
    },
    pickupLocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Pickup location is required" },
      },
    },
    dropoffLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    totalDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1, msg: "Booking must be at least 1 day" },
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: 0.01, msg: "Total amount must be greater than 0" },
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "REFUNDED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["carId"] },
      { fields: ["status"] },
      { fields: ["pickupDate"] },
      { fields: ["dropoffDate"] },
    ],
  },
);

module.exports = Booking;
