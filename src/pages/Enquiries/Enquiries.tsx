import React, { useEffect, useState } from 'react';
import { enquiryService, type EnquiryItem } from '@/services/enquiry.service';
import { toast } from 'sonner';
import { Trash2, MessageSquare } from 'lucide-react';

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken') || undefined;
      const data = await enquiryService.getAllEnquiries(token);
      setEnquiries(data);
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
      toast.error('Failed to fetch enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken') || undefined;
      const updated = await enquiryService.updateStatus(id, newStatus, token);
      setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item)));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken') || undefined;
      await enquiryService.deleteEnquiry(id, token);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      toast.success('Enquiry deleted successfully');
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
      toast.error('Failed to delete enquiry');
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Customer Enquiries</h2>
          <p className="text-gray-600 text-sm">Manage and follow up on experience enquiries submitted by users.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mb-3" strokeWidth={1.5} />
          <p className="text-base font-medium">No enquiries submitted yet.</p>
          <p className="text-xs text-gray-400 mt-1">When users submit inquiries from the mobile app, they will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">User & Contact</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Experience</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Message / Question</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Submitted On</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id} className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors align-top">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">{enq.name}</span>
                      <span className="text-xs text-blue-600 font-mono mt-0.5">{enq.phone}</span>
                      {enq.user && (
                        <span className="text-xs text-gray-400 mt-1">Account: {enq.user.email}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      {enq.project ? (
                        <>
                          {enq.project.images && enq.project.images[0] ? (
                            <img src={enq.project.images[0]} alt={enq.project.title} className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs shrink-0">EX</div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 text-sm line-clamp-1">{enq.project.title}</span>
                            <span className="text-xs text-gray-500">{enq.project.location || 'Dubai'}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Project removed</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {enq.message ? enq.message : <span className="text-gray-400 italic">No message included</span>}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none transition-colors ${getStatusBadgeStyle(enq.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(enq.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                      title="Delete enquiry"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
