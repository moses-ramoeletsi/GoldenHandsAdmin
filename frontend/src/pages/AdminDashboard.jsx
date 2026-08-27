import React, { useState } from 'react';
import { Menu } from 'lucide-react';

// Import independent components
import Sidebar from '../components/Sidebar';
import StudentsTab from '../components/StudentsTab';
import GalleryTab from '../components/GalleryTab';
// import ServicesTab from '../components/ServicesTab';   // Make sure to create this
// import CoursesTab from '../components/CoursesTab';     // Make sure to create this

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'students': return <StudentsTab />;
      case 'gallery': return <GalleryTab />;
      // case 'services': return <ServicesTab />;
      // case 'courses': return <CoursesTab />;
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
        {/* Mobile Header */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button onClick={() => setIsMobileOpen(true)} className="text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}