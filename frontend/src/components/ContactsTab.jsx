import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { contactFunctionStore } from '../store/contact.store';
import toast from 'react-hot-toast';
import ConfirmDialog from './ConfirmDialog';

const ContactsTab = () => {
  const { contacts, fetchContacts, updateContactStatus, deleteContact, isLoading } = contactFunctionStore();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => { fetchContacts(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    const result = await updateContactStatus(id, newStatus);
    if (result.success) toast.success(`Message marked as ${newStatus}`);
    else toast.error(result.message);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteContact(deleteId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const filteredContacts = filterStatus === 'All' 
    ? contacts 
    : contacts.filter(c => c.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Unread': return 'bg-red-100 text-red-800 border-red-200';
      case 'Read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Replied': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Messages Management</h2>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Unread', 'Read', 'Replied'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-yellow-500" size={40} /></div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900">No messages found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContacts.map(contact => (
                  <tr key={contact._id} className={`hover:bg-gray-50/80 transition-colors ${contact.status === 'Unread' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {contact.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-xs" title={contact.message}>
                        {contact.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${getStatusColor(contact.status)}`}
                      >
                        <option value="Unread">Unread</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setDeleteId(contact._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ContactsTab;