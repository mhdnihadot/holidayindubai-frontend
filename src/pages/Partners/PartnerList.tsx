import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Handshake, Search } from 'lucide-react';
import { partnerService, type PartnerItem } from '@/services/partner.service';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Deactivated', value: 'deactivated' },
];

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${
      status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
    }`}
  >
    {status === 'active' ? 'Active' : 'Deactivated'}
  </span>
);

const PartnerList: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        setPartners(await partnerService.list({ search: search || undefined, status: status || undefined }));
      } catch {
        toast.error('Failed to fetch partners');
      } finally {
        setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, status]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">HID PARTNER Accounts</h2>
          <p className="text-gray-600 text-sm">Partners register from the HID PARTNER app. Assign activities to let them see their stats.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, business, email or phone"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg self-start">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${status === f.value ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <Handshake className="w-10 h-10 text-gray-300 mb-3" strokeWidth={1.5} />
          <p className="text-base font-medium">No partners found.</p>
          <p className="text-xs text-gray-400 mt-1">New sign-ups from the HID PARTNER app will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Partner</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Contact</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Activities</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Pending requests</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="py-3.5 px-4 text-sm font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/dashboard/partners/${p.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900 text-sm">{p.businessName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-700">{p.email}</div>
                    <div className="text-xs text-blue-600 font-mono mt-0.5">{p.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {p.activityCount ? p.activityCount : <span className="text-amber-600">None assigned</span>}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {p.pendingRequestCount ? (
                      <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-blue-600 text-white text-xs font-semibold">
                        {p.pendingRequestCount}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4"><StatusBadge status={p.status} /></td>
                  <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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

export default PartnerList;
