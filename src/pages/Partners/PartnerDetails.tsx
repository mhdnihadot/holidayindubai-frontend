import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Eye, Globe, MessageCircle, Phone, Trash2, KeyRound, X, type LucideIcon } from 'lucide-react';
import {
  partnerService,
  getApiErrorMessage,
  type PartnerDetails as PartnerDetailsType,
  type PartnerAnalytics,
  type EventCounts,
} from '@/services/partner.service';
import { projectService, type Project } from '@/services/project.service';
import { StatusBadge } from './PartnerList';

const RANGES = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

const METRICS: { key: keyof EventCounts; label: string; short: string; Icon: LucideIcon }[] = [
  { key: 'view', label: 'Page views', short: 'Views', Icon: Eye },
  { key: 'website', label: 'Website clicks', short: 'Website', Icon: Globe },
  { key: 'whatsapp', label: 'WhatsApp clicks', short: 'WhatsApp', Icon: MessageCircle },
  { key: 'call', label: 'Call clicks', short: 'Call', Icon: Phone },
];

const SOURCES: { key: keyof PartnerAnalytics['bySource']; label: string }[] = [
  { key: 'app_ios', label: 'HID app · iOS' },
  { key: 'app_android', label: 'HID app · Android' },
  { key: 'web_mobile', label: 'Website · Mobile' },
  { key: 'web_desktop', label: 'Website · Desktop' },
];

const randomPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};

const PartnerDetails: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<PartnerDetailsType | null>(null);
  const [projects, setProjects] = useState<(Project & { partner?: string | null })[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [busy, setBusy] = useState(false);

  const [days, setDays] = useState(30);
  const [unique, setUnique] = useState(false);
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);

  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const loadPartner = useCallback(async () => {
    try {
      setPartner(await partnerService.getById(id));
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to load partner'));
      navigate('/dashboard/partners');
    }
  }, [id, navigate]);

  const loadProjects = useCallback(async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data || []);
    } catch {
      toast.error('Failed to load activities');
    }
  }, []);

  useEffect(() => {
    partnerService
      .getById(id)
      .then(setPartner)
      .catch((error) => {
        toast.error(getApiErrorMessage(error, 'Failed to load partner'));
        navigate('/dashboard/partners');
      });
    projectService
      .getAll()
      .then((response) => setProjects(response.data || []))
      .catch(() => toast.error('Failed to load activities'));
  }, [id, navigate]);

  useEffect(() => {
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    partnerService
      .getAnalytics(id, { from: from.toISOString(), to: to.toISOString(), unique })
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, [id, days, unique, partner?.activities.length]);

  const assignable = useMemo(
    () => projects.filter((p) => p.partner !== id),
    [projects, id]
  );
  const selected = projects.find((p) => p.id === selectedProject);

  const handleAssign = async () => {
    if (!selectedProject) return;
    if (selected?.partner && !window.confirm('This activity is already assigned to another partner. Move it to this partner?')) return;
    setBusy(true);
    try {
      await partnerService.assignActivity(id, selectedProject);
      toast.success('Activity assigned');
      setSelectedProject('');
      await Promise.all([loadPartner(), loadProjects()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to assign activity'));
    } finally {
      setBusy(false);
    }
  };

  const handleUnassign = async (projectId: string, title: string) => {
    if (!window.confirm(`Remove "${title}" from this partner? They will no longer see its stats.`)) return;
    try {
      await partnerService.unassignActivity(id, projectId);
      toast.success('Activity removed');
      await Promise.all([loadPartner(), loadProjects()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to remove activity'));
    }
  };

  const handleToggleStatus = async () => {
    if (!partner) return;
    const next = partner.status === 'active' ? 'deactivated' : 'active';
    if (next === 'deactivated' && !window.confirm('Deactivate this partner? They will be logged out and cannot log in until reactivated.')) return;
    try {
      await partnerService.updateStatus(id, next);
      toast.success(next === 'active' ? 'Partner activated' : 'Partner deactivated');
      loadPartner();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to update status'));
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setBusy(true);
    try {
      await partnerService.resetPassword(id, newPassword);
      toast.success('Password reset. Share the new password with the partner.');
      setResetOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to reset password'));
    } finally {
      setBusy(false);
    }
  };

  if (!partner) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/dashboard/partners" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> All partners
      </Link>

      {/* Profile */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{partner.businessName}</h2>
            <StatusBadge status={partner.status} />
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600">
            <div>Contact: <span className="text-gray-900">{partner.name}</span></div>
            <div>Email: <span className="text-gray-900">{partner.email}</span></div>
            <div>Phone: <span className="text-gray-900 font-mono">{partner.phone}</span></div>
            <div>Joined: <span className="text-gray-900">{new Date(partner.createdAt).toLocaleDateString()}</span></div>
            <div>Last login: <span className="text-gray-900">{partner.lastLoginAt ? new Date(partner.lastLoginAt).toLocaleString() : '—'}</span></div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => { setNewPassword(randomPassword()); setResetOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <KeyRound className="w-4 h-4" strokeWidth={1.5} /> Reset password
          </button>
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-2 text-sm rounded-lg border ${partner.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {partner.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Assigned activities</h3>
            <p className="text-sm text-gray-500">The partner sees stats for these and can request changes.</p>
          </div>
          <Link to={`/dashboard/partners/requests?partnerId=${partner.id}`} className="text-sm text-blue-600 hover:underline">
            View change requests
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="">Select an activity to assign…</option>
            {assignable.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}{p.partner ? ' (assigned to another partner)' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selectedProject || busy}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Assign
          </button>
        </div>

        {partner.activities.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center border border-dashed border-gray-200 rounded-lg">
            No activities assigned yet. The partner sees an empty state in the app until you assign one.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
            {partner.activities.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                {a.image ? (
                  <img src={a.image} alt={a.title} className="w-10 h-10 rounded object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/dashboard/projects/edit/${a.id}`} className="text-sm font-medium text-gray-900 hover:underline line-clamp-1">{a.title}</Link>
                  <div className="text-xs text-gray-500">{[a.category, a.emirate, a.status].filter(Boolean).join(' · ')}</div>
                </div>
                <button
                  onClick={() => handleUnassign(a.id, a.title)}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50"
                  title="Remove from partner"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Performance</h3>
            <p className="text-sm text-gray-500">Same numbers the partner sees in the app.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {RANGES.map((r) => (
                <button
                  key={r.days}
                  onClick={() => setDays(r.days)}
                  className={`px-3 py-1.5 text-sm rounded-md ${days === r.days ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {[false, true].map((u) => (
                <button
                  key={String(u)}
                  onClick={() => setUnique(u)}
                  className={`px-3 py-1.5 text-sm rounded-md ${unique === u ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600'}`}
                >
                  {u ? 'Unique' : 'Total'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!analytics ? (
          <p className="text-sm text-gray-500">No data.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {METRICS.map(({ key, label, Icon }) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon className="w-4 h-4 text-blue-600" strokeWidth={1.5} /> {label}
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 mt-1">{analytics.totals[key].toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Previous period: {analytics.previousTotals[key].toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">By source</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-2 font-medium">Source</th>
                      {METRICS.map((m) => <th key={m.key} className="py-2 font-medium text-right">{m.short}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {SOURCES.map((s) => (
                      <tr key={s.key} className="border-b border-gray-100">
                        <td className="py-2 text-gray-700">{s.label}</td>
                        {METRICS.map((m) => <td key={m.key} className="py-2 text-right text-gray-900">{analytics.bySource[s.key][m.key]}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">By activity</h4>
                {analytics.byProject.length === 0 ? (
                  <p className="text-sm text-gray-500">No activities assigned.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th className="py-2 font-medium">Activity</th>
                        {METRICS.map((m) => <th key={m.key} className="py-2 font-medium text-right">{m.short}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.byProject.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100">
                          <td className="py-2 text-gray-700 line-clamp-1">{p.title}</td>
                          {METRICS.map((m) => <td key={m.key} className="py-2 text-right text-gray-900">{p.counts[m.key]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setResetOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Reset password</h3>
              <button onClick={() => setResetOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The partner is logged out of all devices. Copy the new password and send it to them directly.
            </p>
            <div className="flex gap-2">
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => { navigator.clipboard?.writeText(newPassword); toast.success('Copied'); }}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setResetOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleResetPassword}
                disabled={busy}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Reset password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDetails;
