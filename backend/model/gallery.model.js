import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["hair", "nails"],
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image URL or path is required"],
    trim: true,
  },
}, {
  timestamps: true,
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;