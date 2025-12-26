import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173", // or 3000, whatever dev port
  "https://estimate-frotented.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow REST tools or non-browser clients with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // if you ever send cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// If needed for preflight
// app.options("*", cors());

export default app;
