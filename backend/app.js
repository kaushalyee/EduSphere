const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EduSphere API is running" });
});

// Routes
app.use("/api/auth", authRoutes);

//admin routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);



module.exports = app;