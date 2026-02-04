// ═══════════════════════════════════════════════════════════════
// AUTO PRIME CAR RENTAL - BACKEND SERVER
// Main server file with Express, Sequelize (MySQL), and API routes
// ═══════════════════════════════════════════════════════════════

const express = require("express");
const config = require("./src/config/env");
const { connectDB, sequelize } = require("./src/config/db");
const corsMiddleware = require("./src/config/cors");
const errorHandler = require("./src/middleware/errorHandler");
const { generalLimiter } = require("./src/middleware/rateLimiter");
const bcrypt = require("bcryptjs");

// Import all models
const User = require("./src/models/User");
const Car = require("./src/models/Car");
const Booking = require("./src/models/Booking");
const Payment = require("./src/models/Payment");
const Review = require("./src/models/Review");
const Wishlist = require("./src/models/Wishlist");
const Newsletter = require("./src/models/Newsletter");
const ContactMessage = require("./src/models/ContactMessage");

// Import all routes
const authRoutes = require("./src/routes/authRoutes");
const carRoutes = require("./src/routes/carRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const userRoutes = require("./src/routes/userRoutes");
const hostRoutes = require("./src/routes/hostRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const newsletterRoutes = require("./src/routes/newsletterRoutes");
const contactRoutes = require("./src/routes/contactRoutes");

// Initialize Express app
const app = express();

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════════
// MODEL ASSOCIATIONS
// Define relationships between database models
// ═══════════════════════════════════════════════════════════════

// User-Car associations (Host relationship)
User.hasMany(Car, { foreignKey: "hostId", as: "cars" });
Car.belongsTo(User, { foreignKey: "hostId", as: "host" });

// User-Booking associations
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

// Car-Booking associations
Car.hasMany(Booking, { foreignKey: "carId", as: "bookings" });
Booking.belongsTo(Car, { foreignKey: "carId", as: "car" });

// User-Payment associations
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Booking-Payment associations
Booking.hasOne(Payment, { foreignKey: "bookingId", as: "payment" });
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

// User-Review associations
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// Car-Review associations
Car.hasMany(Review, { foreignKey: "carId", as: "reviews" });
Review.belongsTo(Car, { foreignKey: "carId", as: "car" });

// User-Wishlist associations
User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlists" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });

// Car-Wishlist associations
Car.hasMany(Wishlist, { foreignKey: "carId", as: "wishlists" });
Wishlist.belongsTo(Car, { foreignKey: "carId", as: "car" });

// ═══════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════

// Apply rate limiter to all routes
app.use(generalLimiter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auto Prime Backend API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);

// 404 Handler for undefined routes - FIXED FOR EXPRESS 5
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════════
// ADMIN USER SEEDING
// Creates default admin user if it doesn't exist
// ═══════════════════════════════════════════════════════════════

const seedAdminUser = async () => {
  try {
    // Check if admin config exists and is properly defined
    if (!config.admin || !config.admin.email || !config.admin.password) {
      console.log("⚠️  Admin configuration not found in environment variables");
      console.log(
        "   Using default values: admin@autoprime.com / Admin@123456",
      );

      // Use fallback values if config is undefined
      const adminEmail = "admin@autoprime.com";
      const adminPassword = "Admin@123456";

      const existingAdmin = await User.findOne({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await User.create({
          name: "System Admin",
          email: adminEmail,
          password: hashedPassword,
          phone: "1234567890",
          role: "ADMIN",
          isVerified: true,
        });

        console.log("✅ Default admin user created successfully");
        console.log("   📧 Email:", adminEmail);
        console.log("   🔑 Password:", adminPassword);
        console.log("   ⚠️  Please change the password after first login");
      } else {
        console.log("✅ Admin user already exists");
      }

      return;
    }

    // Normal flow with config values
    const existingAdmin = await User.findOne({
      where: { email: config.admin.email },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(config.admin.password, 10);
      await User.create({
        name: "System Admin",
        email: config.admin.email,
        password: hashedPassword,
        phone: "1234567890",
        role: "ADMIN",
        isVerified: true,
      });

      console.log("✅ Admin user created successfully");
      console.log("   📧 Email:", config.admin.email);
      console.log("   🔑 Password:", config.admin.password);
      console.log("   ⚠️  Please change the password after first login");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
  }
};

// ═══════════════════════════════════════════════════════════════
// SERVER STARTUP
// Initialize database connection and start the server
// ═══════════════════════════════════════════════════════════════

const startServer = async () => {
  try {
    console.log("\n🚀 Starting Auto Prime Backend Server...\n");

    // Connect to database
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.log("⚠️  Starting server without database connection");
      console.log("   Please fix database issues and restart\n");
    } else {
      // Seed admin user after successful database connection
      await seedAdminUser();
    }

    // Start Express server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(
        "\n═══════════════════════════════════════════════════════════",
      );
      console.log("🎉 AUTO PRIME BACKEND SERVER RUNNING");
      console.log(
        "═══════════════════════════════════════════════════════════",
      );
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`📊 Environment: ${config.env}`);
      console.log(`💾 Database: MySQL (${config.database.name})`);
      console.log(`🔐 CORS enabled for: localhost:3000`);
      console.log(
        "═══════════════════════════════════════════════════════════\n",
      );
      console.log("✅ Server is ready to accept requests\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
