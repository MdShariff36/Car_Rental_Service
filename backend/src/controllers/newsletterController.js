const Newsletter = require("../models/Newsletter");
const {
  successResponse,
  errorResponse,
  createdResponse,
} = require("../utils/response");

// POST /api/newsletter/subscribe - Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, "Email is required", 400);
    }

    const existing = await Newsletter.findOne({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        return errorResponse(res, "Email already subscribed", 400);
      } else {
        existing.isActive = true;
        await existing.save();
        return successResponse(res, "Resubscribed successfully");
      }
    }

    await Newsletter.create({ email });

    return createdResponse(res, "Subscribed successfully");
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return errorResponse(res, "Subscription failed", 500);
  }
};

module.exports = { subscribe };
