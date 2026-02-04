// ═══════════════════════════════════════════════════════════════
// REVIEW MODEL
// Database model for car reviews and ratings
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Review = sequelize.define(
  "Review",
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: 1, msg: "Rating must be at least 1" },
        max: { args: 5, msg: "Rating cannot exceed 5" },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Whether the reviewer has actually rented this car",
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["carId"] },
      { fields: ["rating"] },
      { fields: ["createdAt"] },
    ],
  },
);

module.exports = Review;
