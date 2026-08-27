import React, { useState, useEffect } from 'react';
import { Image, Plus, Edit, Trash2, X, Save, Loader2, Upload } from 'lucide-react';
import { galleryFunctionStore } from '../store/gallery.store';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const GalleryTab = () => {
  const { galleryItems, fetchGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem, isLoading } = galleryFunctionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ category: '', title: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { 
    fetchGalleryItems(); 
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Live preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Require image only if it's a new item (editing can keep the old image)
    if (!formData.category || !formData.title || (!editingItem && !imageFile)) {
      setError("Please fill in all required fields and select an image");
      return;
    }

    const data = new FormData();
    data.append('category', formData.category);
    data.append('title', formData.title);
    if (imageFile) {
      data.append('image', imageFile);
    }

    let result;
    if (editingItem) {
      result = await updateGalleryItem(editingItem._id || editingItem.id, data);
    } else {
      result = await addGalleryItem(data);
    }

    if (result && result.success) {
      toast.success(result.message);
      closeModal();
    } else {
      toast.error(result?.message || "An error occurred");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ category: item.category, title: item.title });
      setImagePreview(item.image || '');
      setImageFile(null); // Reset file, user must choose a new one to update
    } else {
      setEditingItem(null);
      setFormData({ category: '', title: '' });
      setImageFile(null);
      setImagePreview('');
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ category: '', title: '' });
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const initiateDelete = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteGalleryItem(deleteId);
    if (result && result.success) {
      toast.success(result.message);
    } else {
      toast.error(result?.message || 'Failed to delete item');
    }
    setIsDeleting(false);
    setDeleteId(null); // Close dialog
  };

  const filteredGallery = filterCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(g => g.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Gallery Management</h2>
        <button onClick={() => openModal()} disabled={isLoading} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2 disabled:opacity-50">
          <Plus size={20} /> Add Image
        </button>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        {['All', 'Hair', 'Nails'].map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilterCategory(cat)} 
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterCategory === cat ? 'bg-yellow-500 text-black' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && galleryItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-yellow-500" size={40} />
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <Image size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No gallery items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div key={item._id || item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = 'https://placeholder.com/300'; }} 
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-2 capitalize">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openModal(item)} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2 transition">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => initiateDelete(item._id || item.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2 transition">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FULLY RESPONSIVE MODAL */}
            {/* ✅ FULLY RESPONSIVE MODAL WITH HIDDEN SCROLLBAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Modal Container */}
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Sticky Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable Form Area with 'no-scrollbar' class added */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Hair">Hair</option>
                    <option value="Nails">Nails</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                    placeholder="e.g., Beautiful Box Braids" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 text-center hover:bg-gray-50 transition">
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-600">Click to choose file</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-3 h-40 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  {editingItem && !imagePreview && item.image && (
                    <p className="text-xs text-gray-500 mt-2">
                      Current image is saved. Upload a new file to replace it.
                    </p>
                  )}
                </div>

                {error && <div className="text-red-600 font-medium text-sm">{error}</div>}
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-5 py-2.5 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2 disabled:opacity-50 transition"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this image? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GalleryTab;