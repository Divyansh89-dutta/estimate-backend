import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json()); // <-- JSON body parser
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://estimate-frotented.vercel.app"
    ],
    credentials: true,
  })
);


export default app;
