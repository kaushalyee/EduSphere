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

    const server = require("http").createServer(app);
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    global.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
})();