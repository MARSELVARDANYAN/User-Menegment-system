import express from "express";
import {
  uploadPhoto,
  getPhotoById,
  deletePhotoById,
  updatePhotoById,
} from "../controllers/file.controller.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const uploadFileRouter = express.Router();

uploadFileRouter.post("/photo", authMiddleware, upload.single("photo"), uploadPhoto);
uploadFileRouter.get("/photo/:id", authMiddleware, getPhotoById);
uploadFileRouter.delete("/photo/:id", authMiddleware, deletePhotoById);
uploadFileRouter.put("/photo/:id", authMiddleware, upload.single("photo"), updatePhotoById);

export default uploadFileRouter;
