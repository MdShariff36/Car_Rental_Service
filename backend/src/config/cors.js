// ═══════════════════════════════════════════════════════════════
// CORS CONFIGURATION
// Handles Cross-Origin Resource Sharing for frontend-backend communication
// ═══════════════════════════════════════════════════════════════

const cors = require("cors");

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000", // React development server
  "http://127.0.0.1:3000", // Alternative localhost
  "http://localhost:8080", // Same origin (backend)
  "http://127.0.0.1:8080", // Alternative same origin
];

// CORS options configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("⚠️  CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // Cache preflight requests for 24 hours
  optionsSuccessStatus: 200, // For legacy browser support
};

// Export configured CORS middleware
module.exports = cors(corsOptions);
