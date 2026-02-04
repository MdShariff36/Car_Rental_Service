// ═══════════════════════════════════════════════════════════════
// EMAIL HELPER UTILITIES
// Email sending utilities using Nodemailer
// ═══════════════════════════════════════════════════════════════

const nodemailer = require("nodemailer");
const config = require("../config/env");

/**
 * Create email transporter
 */
const createTransporter = () => {
  if (!config.email.user || !config.email.password) {
    console.warn(
      "⚠️  Email credentials not configured. Email features will not work.",
    );
    return null;
  }

  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("⚠️  Email not sent - transporter not configured");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const mailOptions = {
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `http://localhost:3000/verify-email/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Auto Prime!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for registering with Auto Prime. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">Auto Prime Car Rental Service</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Verify Your Email - Auto Prime",
    html,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">Auto Prime Car Rental Service</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Password Reset - Auto Prime",
    html,
  });
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async (user, booking, car) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Booking Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Your car rental booking has been confirmed.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Car:</strong> ${car.name}</p>
        <p><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</p>
        <p><strong>Dropoff Date:</strong> ${new Date(booking.dropoffDate).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${booking.pickupLocation}</p>
        <p><strong>Total Amount:</strong> $${booking.totalAmount}</p>
        <p><strong>Booking ID:</strong> #${booking.id}</p>
      </div>
      <p>Thank you for choosing Auto Prime!</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">Auto Prime Car Rental Service</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Booking Confirmation - Auto Prime",
    html,
  });
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #007bff;">Welcome to Auto Prime!</h2>
      <p>Hi ${user.name},</p>
      <p>Welcome to Auto Prime Car Rental Service! We're excited to have you on board.</p>
      <p>With Auto Prime, you can:</p>
      <ul>
        <li>Browse our wide selection of vehicles</li>
        <li>Book cars instantly</li>
        <li>Manage your reservations</li>
        <li>Track your rental history</li>
      </ul>
      <p>Start exploring our available cars and book your next adventure today!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/cars" 
           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Browse Cars
        </a>
      </div>
      <p>If you have any questions, feel free to contact our support team.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #999; font-size: 12px;">Auto Prime Car Rental Service</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Welcome to Auto Prime!",
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmation,
  sendWelcomeEmail,
};
