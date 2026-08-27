import mongoose from "mongoose";
import Gallery from "../model/gallery.model.js";

export const createGalleryItem = async (req, res) => {
  try {
    const { category, title } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!category || !title || !image) {
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

    const newGalleryItem = new Gallery({ category: category.toLowerCase(), title, image });
    const savedItem = await newGalleryItem.save();

    return res.status(201).json({ success: true, message: "Gallery item added successfully", data: savedItem });
  } catch (error) {
    console.error("Error in createGalleryItem:", error);
    return res.status(500).json({ success: false, message: "Server error - please try again" });
  }
};

export const getGalleryItems = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection not available",
      });
    }

    // Optional: Filter by category if provided in query params (e.g., ?category=hair)
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    
    return res.status(200).json({ 
      success: true, 
      count: items.length,
      data: items 
    });
  } catch (error) {
    console.error('getGalleryItems error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Server error while fetching gallery items',
    });
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
    // Only update image if a new file was uploaded
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    return res.status(200).json({ success: true, message: "Gallery item updated successfully", data: updatedItem });
  } catch (error) {
    console.error("Error in updateGalleryItem:", error);
    return res.status(500).json({ success: false, message: "Server error - please try again" });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
      });
    }

    const deletedItem = await Gallery.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteGalleryItem:", error);
    return res.status(500).json({
      success: false,
      message: "Server error - please try again",
    });
  }
};