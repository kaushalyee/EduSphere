const app = require("./app");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Ensure uploads directory exists on server startup
require('./scripts/ensureUploadsDir');

// Add cookie parser middleware
app.use(cookieParser);

// Import and initialize cron jobs
require("./jobs/autoRemoveListings");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI missing in .env");
      process.exit(1);
    }

    await connectDB(); // wait for DB connection
    require("./models");
    console.log("DB connected. Starting server...");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
})();