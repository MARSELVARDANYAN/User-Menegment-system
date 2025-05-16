import express from "express";
import { getUsersByOption, deleteUserById, updateUserById, toggleUserStatus, getUserById, getAllUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const usersRouter = express.Router();

usersRouter.get("/allUsers", authMiddleware, getAllUsers);

usersRouter.get('/users', authMiddleware, getUsersByOption);

usersRouter.get('/users/:id', authMiddleware, getUserById);

usersRouter.delete('/users/:id', authMiddleware, deleteUserById);

usersRouter.put('/users/:id', authMiddleware, updateUserById);

usersRouter.patch('/users/:id/status', authMiddleware, toggleUserStatus);

export default usersRouter;





