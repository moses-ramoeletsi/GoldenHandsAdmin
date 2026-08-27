import express from "express";
import { upload } from "../middleware/upload.js"; // Adjust path if needed
import { 
  createGalleryItem, 
  getGalleryItems, 
  updateGalleryItem, 
  deleteGalleryItem 
} from "../controllers/gallery.controller.js";

const router = express.Router();

// POST: Upload single file + form data
router.post("/", upload.single('image'), createGalleryItem);

// GET
router.get("/", getGalleryItems);

// PUT: Upload single file + form data (file is optional here)
router.put("/:id", upload.single('image'), updateGalleryItem);

// DELETE
router.delete("/:id", deleteGalleryItem);

export default router;