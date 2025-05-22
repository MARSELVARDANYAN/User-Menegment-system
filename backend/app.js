import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import usersRouter from "./routes/users.routes.js";
import uploadFileRouter from "./routes/file.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/", usersRouter);
app.use('/uploads', uploadFileRouter);

export default app;
