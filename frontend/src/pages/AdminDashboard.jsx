import React, { useState, useEffect } from 'react';
import { Users, Image, Briefcase, BookOpen, Plus, Edit, Trash2, X, Menu, Search, Save, LogOut } from 'lucide-react';
import {userFunctionStore} from '../store/user.store';


// Mock initial data
// const initialStudents = [
//   { id: 1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@email.com', contact: '+266 5555 1111', address: '123 Main St, Maseru', program: 'Certificate in Hair Care and Styling', nextOfKinName: 'John Johnson', nextOfKinContact: '+266 5555 2222', enrollmentDate: '2024-01-15' },
//   { id: 2, firstName: 'Maria', lastName: 'Lopez', email: 'maria.l@email.com', contact: '+266 5555 3333', address: '456 Oak Ave, Maseru', program: 'Nail Technology', nextOfKinName: 'Carlos Lopez', nextOfKinContact: '+266 5555 4444', enrollmentDate: '2024-02-01' }
// ];

const initialGallery = [
  { id: 1, category: 'Hair', title: 'Braided Hairstyle', imageUrl: 'https://placeholder.com/300' },
  { id: 2, category: 'Nails', title: 'French Manicure', imageUrl: 'https://placeholder.com/300' },
  { id: 3, category: 'Hair', title: 'Wedding Updo', imageUrl: 'https://placeholder.com/300' }
];

const initialServices = [
  { id: 1, name: 'Hair Styling', description: 'Expert cuts, coloring, and styling for all hair types', price: 'From $50' },
  { id: 2, name: 'Braiding', description: 'Beautiful braids including box braids, cornrows, and more', price: 'From $80' },
  { id: 3, name: 'Nail Services', description: 'Manicures, pedicures, nail art, and extensions', price: 'From $30' }
];

const initialCourses = [
  { id: 1, name: 'Certificate in Hair Care and Styling', duration: '6 months', description: 'Master cutting, coloring, styling, and salon management', available: true },
  { id: 2, name: 'Nail Technology', duration: '3 months', description: 'Learn manicures, pedicures, nail art, and extensions', available: true },
  { id: 3, name: 'Makeup Artistry', duration: '4 months', description: 'Professional makeup for all occasions and skin types', available: false }
];

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'courses', label: 'Courses', icon: BookOpen }
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isMobileOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileOpen(false)}></div>
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">
            <span className="text-yellow-500">Golden Hands</span>
            <br />Admin Panel
          </h1>
        </div>
        <nav className="p-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                activeTab === tab.id ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

// Students Management
const StudentsTab = () => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    contacts: "",
    address: "",
    program: "",
    nextOfKinName: "",
    nextOfKinContacts: "",
  };

  // const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addUser, fetchUsers, students } = userFunctionStore();
  const [formData, setFormData] = useState(initialFormState);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const programTypes = [
    "Hair Care and Styling",
    "Nail Technology",
  ];

  const isEditMode = Boolean(editingStudent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.contacts ||
        !formData.address ||
        !formData.program ||
        !formData.nextOfKinName ||
        !formData.nextOfKinContacts
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      const userToSubmit = { ...formData };

      let result;
      if (isEditMode) {
        // implement update flow when backend route exists
        // e.g. result = await updateUser(editingStudent.id, userToSubmit);
        setError("Edit/update not implemented yet");
        setIsLoading(false);
        return;
      } else {
        result = await addUser(userToSubmit);
      }

      if (result && result.success) {
        // replace toast with simple alert or update UI as needed
        alert(result.message || "User added successfully");
        // optionally refresh list or append locally:
        await fetchUsers();
        closeModal();
      } else {
        setError(result?.message || `Failed to ${isEditMode ? "update" : "add"} user`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const deleteStudent = (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      students(students.filter(s => s.id !== id));
    }
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
            <td className="px-6 py-4 whitespace-nowrap">{student.enrollmentDate ?? ''}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button onClick={() => openModal(student)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit size={18} /></button>
              <button onClick={() => deleteStudent(student._id ?? student.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact</label>
                  <input
                    type="tel"
                    value={formData.contacts}
                    onChange={(e) => setFormData({...formData, contacts: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
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
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">Select Program</option>
                  {programTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Next of Kin Contact</label>
                  <input
                    type="tel"
                    value={formData.nextOfKinContacts}
                    onChange={(e) => setFormData({...formData, nextOfKinContacts: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
              {error && <div className="text-red-600 font-medium">{error}</div>}
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={isLoading} className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2">
                <Save size={18} /> {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Gallery Management
const GalleryTab = () => {
  const [gallery, setGallery] = useState(initialGallery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({ category: '', title: '', imageUrl: '' });

  const handleSubmit = () => {
    if (editingItem) {
      setGallery(gallery.map(g => g.id === editingItem.id ? { ...formData, id: g.id } : g));
    } else {
      setGallery([...gallery, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ category: '', title: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const deleteItem = (id) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      setGallery(gallery.filter(g => g.id !== id));
    }
  };

  const filteredGallery = filterCategory === 'All' ? gallery : gallery.filter(g => g.category === filterCategory);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Gallery Management</h2>
        <button onClick={() => openModal()} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2">
          <Plus size={20} /> Add Image
        </button>
      </div>

      <div className="mb-6 flex gap-3">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-semibold">
              {item.category} Image
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mb-2">{item.category}</span>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openModal(item)} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => deleteItem(item.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
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
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2">
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Services Management
const ServicesTab = () => {
  const [services, setServices] = useState(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });

  const handleSubmit = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...formData, id: s.id } : s));
    } else {
      setServices([...services, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', price: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const deleteService = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Services Management</h2>
        <button onClick={() => openModal()} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2">
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-3">{service.description}</p>
            <p className="text-yellow-500 font-bold mb-4">{service.price}</p>
            <div className="flex gap-2">
              <button onClick={() => openModal(service)} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2">
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => deleteService(service.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., Hair Styling"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="Describe the service..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., From $50"
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2">
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Courses Management
const CoursesTab = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ name: '', duration: '', description: '', available: false });

  const handleSubmit = () => {
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...formData, id: c.id } : c));
    } else {
      setCourses([...courses, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({ name: '', duration: '', description: '', available: false });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const deleteCourse = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setCourses(courses.map(c => c.id === id ? { ...c, available: !c.available } : c));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold">Courses Management</h2>
        <button onClick={() => openModal()} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition flex items-center gap-2">
          <Plus size={20} /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{course.name}</div>
                    <div className="text-sm text-gray-600">{course.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailability(course.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        course.available 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {course.available ? 'Available' : 'Coming Soon'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => openModal(course)} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteCourse(course.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Course Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., Certificate in Hair Care and Styling"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="e.g., 6 months"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none"
                  placeholder="Describe the course..."
                ></textarea>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="available" className="text-sm font-semibold">Course is available for enrollment</label>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2">
                <Save size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'students': return <StudentsTab />;
      case 'gallery': return <GalleryTab />;
      case 'services': return <ServicesTab />;
      case 'courses': return <CoursesTab />;
      default: return <StudentsTab />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}