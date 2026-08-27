import mongoose from "mongoose";
import Gallery from "../model/gallery.model.js";
import cloudinary from "../config/cloudinary.js";

export const createGalleryItem = async (req, res) => {
  try {
    const { category, title } = req.body;

    if (!category || !title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Category, title, and image file are required",
      });
    }

    const validCategories = ["hair", "nails"];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Must be 'hair' or 'nails'",
      });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      folder: "golden-hands-gallery", // Creates a folder in your Cloudinary media library
    });

    const newGalleryItem = new Gallery({
      category: category.toLowerCase(),
      title,
      image: cldRes.secure_url, // Save the permanent Cloudinary URL
    });

    const savedItem = await newGalleryItem.save();

    return res.status(201).json({ 
      success: true, 
      message: "Gallery item added successfully", 
      data: savedItem 
    });
  } catch (error) {
    console.error("Error in createGalleryItem:", error);
    return res.status(500).json({ success: false, message: "Server error - please try again" });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid gallery item ID" });
    }

    const updates = {};
    if (category) updates.category = category.toLowerCase();
    if (title) updates.title = title;

    // If a new image is uploaded, upload to Cloudinary and update URL
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const cldRes = await cloudinary.uploader.upload(dataURI, {
        folder: "golden-hands-gallery",
      });
      updates.image = cldRes.secure_url;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Gallery item updated successfully", 
      data: updatedItem 
    });
  } catch (error) {
    console.error("Error in updateGalleryItem:", error);
    return res.status(500).json({ success: false, message: "Server error - please try again" });
  }
};

// Keep getGalleryItems and deleteGalleryItem exactly as they were
export const getGalleryItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('getGalleryItems error:', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching gallery items' });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid gallery item ID" });
    }
    const deletedItem = await Gallery.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    return res.status(200).json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGalleryItem:", error);
    return res.status(500).json({ success: false, message: "Server error - please try again" });
  }
};