import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import db from "./db";
import errorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routers/auth.router";
import wsGroupChatRouter from "./routers/group-chat.router";

const app = express();
const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use(errorMiddleware);

wsGroupChatRouter.setupRoutes(io, db);

export default server;
