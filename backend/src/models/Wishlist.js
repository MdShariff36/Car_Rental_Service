// ═══════════════════════════════════════════════════════════════
// WISHLIST MODEL
// Database model for user saved/favorite cars
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
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
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["carId"] },
      { fields: ["userId", "carId"], unique: true },
    ],
  },
);

module.exports = Wishlist;
