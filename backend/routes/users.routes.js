import express from "express";
import upload from "../config/multer.js";
import { getUsersByOption, deleteUserById, updateUserById, toggleUserStatus, getUserById, getAllUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const usersRouter = express.Router();

usersRouter.get("/users", authMiddleware, getAllUsers);

usersRouter.get('/users/option', authMiddleware, getUsersByOption);

usersRouter.get('/users/:id', authMiddleware, getUserById);

usersRouter.delete('/users/:id', authMiddleware, deleteUserById);

usersRouter.put('/users/:id', authMiddleware, upload.single("file"), updateUserById);

usersRouter.patch('/users/:id/status', authMiddleware, toggleUserStatus);

export default usersRouter;





