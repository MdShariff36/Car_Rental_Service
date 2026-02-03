const nodemailer = require("nodemailer");
const config = require("../config/env");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: "Password Reset Request - Auto Prime",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password for your Auto Prime account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">Auto Prime - Your Trusted Car Rental Service</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: "Welcome to Auto Prime!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Auto Prime, ${name}! 🚗</h2>
        <p>Thank you for registering with Auto Prime, your trusted car rental service.</p>
        <p>You can now browse our wide selection of vehicles and make bookings easily.</p>
        <a href="http://localhost:3000/cars" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Browse Cars</a>
        <p>If you have any questions, feel free to contact our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">Auto Prime - Your Trusted Car Rental Service</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
};

const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: config.email.from,
    to: email,
    subject: "Booking Confirmation - Auto Prime",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed! 🎉</h2>
        <p>Your car rental booking has been confirmed.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Car:</strong> ${bookingDetails.carName}</p>
          <p><strong>Pickup Date:</strong> ${bookingDetails.pickupDate}</p>
          <p><strong>Dropoff Date:</strong> ${bookingDetails.dropoffDate}</p>
          <p><strong>Location:</strong> ${bookingDetails.pickupLocation}</p>
          <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
        </div>
        <p>Thank you for choosing Auto Prime!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">Auto Prime - Your Trusted Car Rental Service</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Booking confirmation email failed:", error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
};
