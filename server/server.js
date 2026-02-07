import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  return res.send("hii");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
