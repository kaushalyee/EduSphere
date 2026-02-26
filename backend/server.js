const app = require("./app");
const path = require("path");

// Load env first
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

// Debug (temporary)
console.log(" Loaded MONGO_URI?", !!process.env.MONGO_URI);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));