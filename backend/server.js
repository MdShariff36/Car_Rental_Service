const express = require("express");
const config = require("./src/config/env");
const { connectDB, sequelize } = require("./src/config/db");
const corsMiddleware = require("./src/config/cors");
const errorHandler = require("./src/middleware/errorHandler");
const { generalLimiter } = require("./src/middleware/rateLimiter");

const User = require("./src/models/User");
const Car = require("./src/models/Car");
const Booking = require("./src/models/Booking");
const Payment = require("./src/models/Payment");
const Review = require("./src/models/Review");
const Wishlist = require("./src/models/Wishlist");
const Newsletter = require("./src/models/Newsletter");
const ContactMessage = require("./src/models/ContactMessage");

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

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

User.hasMany(Car, { foreignKey: "hostId", as: "cars" });
Car.belongsTo(User, { foreignKey: "hostId", as: "host" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

Car.hasMany(Booking, { foreignKey: "carId", as: "bookings" });
Booking.belongsTo(Car, { foreignKey: "carId", as: "car" });

User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId", as: "user" });

Booking.hasOne(Payment, { foreignKey: "bookingId", as: "payment" });
Payment.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

Car.hasMany(Review, { foreignKey: "carId", as: "reviews" });
Review.belongsTo(Car, { foreignKey: "carId", as: "car" });

User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlist" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });

Car.hasMany(Wishlist, { foreignKey: "carId", as: "wishlistItems" });
Wishlist.belongsTo(Car, { foreignKey: "carId", as: "car" });

app.use(generalLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auto Prime API is running",
    version: "1.0.0",
  });
});

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Route not found",
  });
});

app.use(errorHandler);

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({
      where: { email: config.admin.email },
    });

    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: config.admin.email,
        password: config.admin.password,
        role: "ADMIN",
      });
      console.log("✅ Default admin user created");
      console.log(`   Email: ${config.admin.email}`);
      console.log(`   Password: ${config.admin.password}`);
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminUser();

    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
