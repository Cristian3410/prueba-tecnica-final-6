import express from "express";
import morgan from "morgan";
import authsRoutes from "./routes/auths.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api",authsRoutes);


export default app;