// ═══════════════════════════════════════════════════════════════
// MYSQL DATABASE CONFIGURATION
// Sequelize setup for MySQL with connection pooling
// ═══════════════════════════════════════════════════════════════

const { Sequelize } = require("sequelize");
const config = require("./env");

// Initialize Sequelize with MySQL configuration
const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: config.database.logging,
    pool: config.database.pool,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: false,
    },
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+00:00",
  },
);

/**
 * Connect to MySQL database
 * Creates database if it doesn't exist
 * Syncs all models with database
 */
const connectDB = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");
    console.log(
      `📊 Database: ${config.database.name} on ${config.database.host}:${config.database.port}`,
    );

    // Sync all models with database
    // alter: true will update existing tables to match models
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully");
    console.log("📋 All tables created/updated");

    return true;
  } catch (error) {
    console.error("❌ Unable to connect to MySQL database:");
    console.error("Error:", error.message);

    // Provide helpful error messages
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 Troubleshooting:");
      console.error("   - Make sure MySQL server is running");
      console.error(
        "   - Check if MySQL is listening on port",
        config.database.port,
      );
      console.error("   - Verify MySQL service status");
    } else if (error.message.includes("Access denied")) {
      console.error("\n💡 Troubleshooting:");
      console.error("   - Check DB_USER and DB_PASSWORD in .env file");
      console.error("   - Verify MySQL user has proper permissions");
      console.error(
        "   - Try connecting with: mysql -u",
        config.database.user,
        "-p",
      );
    } else if (error.message.includes("Unknown database")) {
      console.error("\n💡 Creating database...");
      try {
        // Try to create database
        const mysql = require("mysql2/promise");
        const connection = await mysql.createConnection({
          host: config.database.host,
          port: config.database.port,
          user: config.database.user,
          password: config.database.password,
        });

        await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${config.database.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
        );
        console.log("✅ Database created successfully");
        await connection.end();

        // Retry connection
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("✅ Connected and synchronized successfully");
        return true;
      } catch (createError) {
        console.error("❌ Failed to create database:", createError.message);
      }
    }

    console.error(
      "\n⚠️  Server will continue but database operations will fail",
    );
    return false;
  }
};

module.exports = { sequelize, connectDB };
