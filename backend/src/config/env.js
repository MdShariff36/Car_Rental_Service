// ═══════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION LOADER
// Loads and validates environment variables with proper fallbacks
// ═══════════════════════════════════════════════════════════════

require("dotenv").config();

const config = {
  // Server Configuration
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || "development",

  // MySQL Database Configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || "autoprime_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  // JWT Configuration
  jwt: {
    secret:
      process.env.JWT_SECRET || "fallback_secret_key_change_in_production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // Default Admin User Configuration
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@autoprime.com",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
  },

  // Email Configuration
  email: {
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASS || "",
    from: process.env.EMAIL_FROM || "Auto Prime <no-reply@autoprime.com>",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
};

// Validation function to check critical configuration
const validateConfig = () => {
  const warnings = [];

  if (config.jwt.secret === "fallback_secret_key_change_in_production") {
    warnings.push(
      "⚠️  WARNING: Using default JWT secret. Please set JWT_SECRET in .env file",
    );
  }

  if (!config.database.password && config.env === "production") {
    warnings.push(
      "⚠️  WARNING: No database password set for production environment",
    );
  }

  if (!config.email.user || !config.email.password) {
    warnings.push(
      "⚠️  WARNING: Email credentials not configured. Password reset will not work.",
    );
  }

  if (warnings.length > 0) {
    console.log("\n" + warnings.join("\n") + "\n");
  }
};

// Run validation
validateConfig();

module.exports = config;
