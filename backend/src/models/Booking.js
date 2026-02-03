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
        model: "Users",
        key: "id",
      },
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Cars",
        key: "id",
      },
    },
    pickupDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dropoffDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pickupLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "ongoing",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Payments",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Booking;
