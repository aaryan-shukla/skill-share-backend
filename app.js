const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const updateRoutes = require("./routes/updateDetails");
const courseRoutes = require("./routes/courses");
const mentorshipRoutes = require("./routes/mentorships");
const app = express();
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
  });
  next();
});
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

app.use("/api", authRoutes);
app.use("/api", updateRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", mentorshipRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
