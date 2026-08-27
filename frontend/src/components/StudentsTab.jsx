import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Save, Loader2 } from 'lucide-react';
import { userFunctionStore } from '../store/user.store';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const StudentsTab = () => {
  const initialFormState = { 
    firstName: "", lastName: "", email: "", contacts: "", 
    address: "", program: "", nextOfKinName: "", nextOfKinContacts: "" 
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addUser, fetchUsers, updateUser, deleteUser, students, isLoading } = userFunctionStore();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');
  
  // Custom confirmation dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const programTypes = ["Hair Care and Styling", "Nail Technology"];
  const isEditMode = Boolean(editingStudent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.contacts || !formData.address || !formData.program || !formData.nextOfKinName || !formData.nextOfKinContacts) {
      setError("Please fill in all required fields");
      return;
    }

    let result;
    if (isEditMode) {
      result = await updateUser(editingStudent._id || editingStudent.id, formData);
    } else {
      result = await addUser(formData);
    }

    if (result && result.success) {
      toast.success(result.message);
      closeModal();
    } else {
      toast.error(result?.message || "An error occurred");
    }
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({ ...initialFormState });
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ ...initialFormState });
    setError('');
  };

  const initiateDelete = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteUser(deleteId);
    if (result && result.success) {
      toast.success(result.message);
    } else {
      toast.error(result?.message || 'Failed to delete student');
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredStudents = students.filter(s =>
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Students Management</h2>
        <button onClick={() => openModal()} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2">
          <Plus size={20} /> Add Student
        </button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Program</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student._id ?? student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.firstName} {student.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4">{student.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openModal(student)} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => initiateDelete(student._id ?? student.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ FULLY RESPONSIVE MODAL WITH HIDDEN SCROLLBAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Modal Container: flex-col allows internal scrolling */}
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Sticky Header */}
            <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable Form Area with 'no-scrollbar' class */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Contact</label>
                    <input 
                      type="tel" 
                      value={formData.contacts} 
                      onChange={(e) => setFormData({...formData, contacts: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <textarea 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    rows="2" 
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Program</label>
                  <select 
                    value={formData.program} 
                    onChange={(e) => setFormData({...formData, program: e.target.value})} 
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                    required
                  >
                    <option value="">Select Program</option>
                    {programTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Next of Kin Name</label>
                    <input 
                      type="text" 
                      value={formData.nextOfKinName} 
                      onChange={(e) => setFormData({...formData, nextOfKinName: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Next of Kin Contact</label>
                    <input 
                      type="tel" 
                      value={formData.nextOfKinContacts} 
                      onChange={(e) => setFormData({...formData, nextOfKinContacts: e.target.value})} 
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none" 
                      required
                    />
                  </div>
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
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone and all their data will be permanently removed."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default StudentsTab;