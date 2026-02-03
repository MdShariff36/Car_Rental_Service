const Newsletter = require("../models/Newsletter");
const { successResponse, errorResponse } = require("../utils/response");

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }

    const existingSubscription = await Newsletter.findOne({ where: { email } });
    if (existingSubscription) {
      return errorResponse(res, "Email is already subscribed", 400);
    }

    const subscription = await Newsletter.create({ email });

    return successResponse(
      res,
      subscription,
      "Successfully subscribed to newsletter",
      201,
    );
  } catch (error) {
    console.error("Subscribe newsletter error:", error);
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  subscribeNewsletter,
};
