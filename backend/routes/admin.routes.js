import express from "express";
import { createUser } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/create-user", authMiddleware, createUser);

export default adminRouter;
