const ContactMessage = require("../models/ContactMessage");
const { successResponse, errorResponse } = require("../utils/response");

const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return errorResponse(res, "Name, email, and message are required", 400);
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return successResponse(
      res,
      contactMessage,
      "Contact message submitted successfully",
      201,
    );
  } catch (error) {
    console.error("Submit contact form error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  submitContactForm,
};
