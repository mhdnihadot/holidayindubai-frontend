import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, ClipboardList, RotateCcw } from 'lucide-react';
import { partnerService, getApiErrorMessage, type ChangeRequestItem } from '@/services/partner.service';

const FILTERS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Done', value: 'done' },
  { label: 'All', value: '' },
];

const ChangeRequests: React.FC = () => {
  const [searchParams] = useSearchParams();
  const partnerId = searchParams.get('partnerId') || undefined;
  const [status, setStatus] = useState('pending');
  const [requests, setRequests] = useState<ChangeRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        setRequests(await partnerService.listChangeRequests({ status: status || undefined, partnerId }));
      } catch {
        toast.error('Failed to fetch change requests');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [status, partnerId]);

  const update = async (request: ChangeRequestItem, next: 'pending' | 'done') => {
    try {
      const adminNote = notes[request.id] ?? request.adminNote;
      const updated = await partnerService.updateChangeRequest(request.id, { status: next, adminNote });
      setRequests((prev) =>
        status && updated.status !== status ? prev.filter((r) => r.id !== request.id) : prev.map((r) => (r.id === request.id ? updated : r))
      );
      toast.success(next === 'done' ? 'Marked as done' : 'Moved back to pending');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update request'));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Partner Change Requests</h2>
          <p className="text-gray-600 text-sm">
            Requests partners send from the HID PARTNER app. Edit the activity, then mark the request done — the partner sees your note.
          </p>
          {partnerId && (
            <Link to="/dashboard/partners/requests" className="text-xs text-blue-600 hover:underline">Showing one partner · show all</Link>
          )}
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg self-start">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 text-sm rounded-md ${status === f.value ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
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
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-gray-500 flex flex-col items-center">
          <ClipboardList className="w-10 h-10 text-gray-300 mb-3" strokeWidth={1.5} />
          <p className="text-base font-medium">No requests here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    {r.project ? (
                      <Link to={`/dashboard/projects/edit/${r.project.id}`} className="font-semibold text-gray-900 hover:underline">{r.project.title}</Link>
                    ) : (
                      <span className="italic text-gray-400">Activity removed</span>
                    )}
                    <span className="text-gray-300">·</span>
                    {r.partner ? (
                      <Link to={`/dashboard/partners/${r.partner.id}`} className="text-gray-600 hover:underline">{r.partner.businessName}</Link>
                    ) : (
                      <span className="text-gray-400">Unknown partner</span>
                    )}
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2 leading-relaxed">{r.message}</p>
                  <input
                    value={notes[r.id] ?? r.adminNote}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    placeholder="Note for the partner (optional)"
                    className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="shrink-0">
                  {r.status === 'pending' ? (
                    <button
                      onClick={() => update(r, 'done')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" strokeWidth={1.5} /> Mark done
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
                        Done {r.resolvedAt ? `· ${new Date(r.resolvedAt).toLocaleDateString()}` : ''}
                      </span>
                      <button
                        onClick={() => update(r, 'pending')}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900"
                      >
                        <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} /> Reopen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChangeRequests;
