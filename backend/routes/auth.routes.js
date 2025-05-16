import express from "express";
import {
  login,
  logout,
  registerUser,
  forgotPassword,
  forgotPasswordReset,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", registerUser);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/forgot-password-reset", forgotPasswordReset);

authRouter.get("/logout", logout);

export default authRouter;
