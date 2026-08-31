import React from 'react';
import { Users, Image, Briefcase, BookOpen, LogOut, Calendar, Mail } from 'lucide-react';
import logo from '../assets/images/GHA.png'; // Adjust path if needed

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'gallery', label: 'Gallery', icon: Image },
    // { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'contacts', label: 'Contacts', icon: Mail }
    // { id: 'courses', label: 'Courses', icon: BookOpen }

  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isMobileOpen ? 'block' : 'hidden'}`} 
        onClick={() => setIsMobileOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="p-6 border-b border-gray-800 flex flex-col items-center">
          <img src={logo} alt="Golden Hands" className="h-20 w-auto object-contain mb-2" />
          <h1 className="text-xl font-bold text-center text-gray-300">Admin Panel</h1>
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
                activeTab === tab.id ? 'bg-yellow-500 text-black font-semibold' : 'hover:bg-gray-800'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-red-400 hover:text-red-300">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;