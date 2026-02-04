// ═══════════════════════════════════════════════════════════════
// NEWSLETTER MODEL
// Database model for newsletter email subscribers
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Newsletter = sequelize.define(
  "Newsletter",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: "Email already subscribed to newsletter",
      },
      validate: {
        isEmail: { msg: "Invalid email format" },
        notEmpty: { msg: "Email is required" },
      },
    },
    subscribedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "newsletters",
    timestamps: true,
    indexes: [{ fields: ["email"], unique: true }, { fields: ["isActive"] }],
  },
);

module.exports = Newsletter;
