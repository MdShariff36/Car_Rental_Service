const ContactMessage = require("../models/ContactMessage");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");

// POST /api/contact - Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, "All required fields must be filled", 400);
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return createdResponse(
      res,
      "Message sent successfully. We will get back to you soon.",
      contact,
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return errorResponse(res, "Failed to send message", 500);
  }
};

module.exports = { submitContact };
