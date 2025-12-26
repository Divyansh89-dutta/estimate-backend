import "./src/config/env.js";

import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js"; // 👈 default import
import profileRoutes from "./src/routes/profile.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import estimateRoutes from "./src/routes/estimate.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import companyRoutes from "./src/routes/company.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import { Server } from "socket.io";
import { socketHandler } from "./src/sockets/notification.socket.js";

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/upload", uploadRoutes);
// Server + Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});
app.set("io", io); // Make io accessible in routes/controllers
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
