// ═══════════════════════════════════════════════════════════════
// CONTACT MESSAGE MODEL
// Database model for contact form submissions
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: { msg: "Invalid email format" },
        notEmpty: { msg: "Email is required" },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Subject is required" },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Message is required" },
      },
    },
    status: {
      type: DataTypes.ENUM("NEW", "READ", "REPLIED", "CLOSED"),
      defaultValue: "NEW",
      allowNull: false,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "contact_messages",
    timestamps: true,
    indexes: [
      { fields: ["email"] },
      { fields: ["status"] },
      { fields: ["createdAt"] },
    ],
  },
);

module.exports = ContactMessage;
