const app = require("./app");
require("dotenv").config(); // loads .env from same folder
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI missing in .env");
      process.exit(1);
    }

    await connectDB(); // wait for DB connection
    console.log("✅ DB connected. Starting server...");

    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
})();