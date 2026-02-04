// ═══════════════════════════════════════════════════════════════
// CAR MODEL
// Database model for vehicle listings
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Car name is required" },
      },
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Brand is required" },
      },
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Model is required" },
      },
    },
    category: {
      type: DataTypes.ENUM(
        "Sedan",
        "SUV",
        "Luxury",
        "Sports",
        "Electric",
        "Convertible",
        "Truck",
        "Van",
      ),
      allowNull: false,
      defaultValue: "Sedan",
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1900, msg: "Year must be 1900 or later" },
        max: {
          args: new Date().getFullYear() + 1,
          msg: "Year cannot be in the future",
        },
      },
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: { args: 2, msg: "Must have at least 2 seats" },
        max: { args: 12, msg: "Cannot exceed 12 seats" },
      },
    },
    transmission: {
      type: DataTypes.ENUM("Automatic", "Manual"),
      allowNull: false,
      defaultValue: "Automatic",
    },
    fuelType: {
      type: DataTypes.ENUM("Petrol", "Diesel", "Electric", "Hybrid"),
      allowNull: false,
      defaultValue: "Petrol",
    },
    luggage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      validate: {
        min: { args: 0, msg: "Luggage capacity cannot be negative" },
      },
    },
    pricePerDay: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: 0.01, msg: "Price must be greater than 0" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "RENTED", "MAINTENANCE", "INACTIVE"),
      defaultValue: "AVAILABLE",
      allowNull: false,
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "cars",
    timestamps: true,
    indexes: [
      { fields: ["hostId"] },
      { fields: ["status"] },
      { fields: ["category"] },
      { fields: ["brand"] },
      { fields: ["pricePerDay"] },
    ],
  },
);

module.exports = Car;
