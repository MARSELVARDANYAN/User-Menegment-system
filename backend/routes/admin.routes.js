import express from "express";
import upload from "../config/multer.js";
import { createUser, getAdminById, editAdminById, deleteAdminAvatar } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Users from "../models/Users.model.js";
import bcrypt from "bcrypt";

const adminRouter = express.Router();

adminRouter.post("/create-user", authMiddleware, createUser);

adminRouter.get("/:id", authMiddleware, getAdminById);

adminRouter.put("/:id", authMiddleware, upload.single("file"), editAdminById);

adminRouter.delete("/:id/avatar", authMiddleware, deleteAdminAvatar);

adminRouter.post("/create", async (req, res) => {
  const { email, role, password, name } = req.body;

  // Logic to create a new user
  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Users({ email, role, password: hashedPassword, status: "active", name });
  await newUser.save();

  res.status(201).json({ message: "User created successfully" });
});

  


export default adminRouter;
