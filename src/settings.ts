import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routers/auth.router";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRouter);

app.use(errorMiddleware);
export default app;
