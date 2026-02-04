// ═══════════════════════════════════════════════════════════════
// PAYMENT MODEL
// Database model for payment transactions
// ═══════════════════════════════════════════════════════════════

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Payment = sequelize.define(
  "Payment",
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
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bookings",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: 0.01, msg: "Amount must be greater than 0" },
      },
    },
    method: {
      type: DataTypes.ENUM(
        "CREDIT_CARD",
        "DEBIT_CARD",
        "PAYPAL",
        "BANK_TRANSFER",
        "CASH",
      ),
      allowNull: false,
      defaultValue: "CREDIT_CARD",
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "REFUNDED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    cardLast4: {
      type: DataTypes.STRING(4),
      allowNull: true,
      validate: {
        len: {
          args: [4, 4],
          msg: "Card last 4 digits must be exactly 4 characters",
        },
      },
    },
    cardBrand: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["bookingId"] },
      { fields: ["status"] },
      { fields: ["transactionId"], unique: true },
    ],
  },
);

module.exports = Payment;
