import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAdService } from '@/services/admin.ad.service';
import type { Ad } from '@/services/ad.service';
import { Plus, Search, Edit2, Trash2, Loader2, AlertCircle, Image as ImageIcon, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const AdList: React.FC = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAdService.getAll();
      const data = response.data || response;
      setAds(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError('Failed to fetch advertisements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchesTitle = ad.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const projectName = typeof ad.project === 'object' && ad.project ? ad.project.title : '';
      const matchesProject = projectName ? projectName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
      return matchesTitle || matchesProject;
    });
  }, [ads, searchTerm]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the advertisement "${title}"?`)) {
      setIsDeleting(id);
      try {
        await adminAdService.delete(id);
        toast.success('Advertisement deleted successfully');
        setAds((prev) => prev.filter((item) => item.id !== id && (item as any)._id !== id));
      } catch (err) {
        toast.error('Failed to delete advertisement');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading && ads.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advertisements & Banners</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage promotional banners for website & mobile app, connected directly to your projects</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/ads/add')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm w-full sm:w-auto justify-center font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Add Advertisement</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-black shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search advertisements by title or connected project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Banners (Web & Mobile)</th>
                <th className="px-6 py-4 font-semibold w-1/3">Ad Title & Connected Project</th>
                <th className="px-6 py-4 font-semibold w-1/6">Order</th>
                <th className="px-6 py-4 font-semibold text-center w-1/6">Status</th>
                <th className="px-6 py-4 font-semibold text-right w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 mb-3 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        No advertisements found
                      </p>
                      <p>Try adjusting your search query or upload a new ad banner.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => {
                  const id = ad.id || (ad as any)._id;
                  return (
                    <tr
                      key={id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative shadow-xs" title="Website Banner (Desktop/Tablet)">
                            {ad.websiteImage ? (
                              <img src={ad.websiteImage} alt={`${ad.title} Web`} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/65 text-[10px] text-white text-center py-0.5 font-sans font-semibold">Web</span>
                          </div>
                          <div className="w-12 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative shadow-xs" title="Mobile Banner (App/Smartphone)">
                            {ad.mobileImage ? (
                              <img src={ad.mobileImage} alt={`${ad.title} Mobile`} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/65 text-[10px] text-white text-center py-0.5 font-sans font-semibold">Mobile</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-white block text-base">{ad.title}</span>
                        {ad.project ? (
                          <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Project: {typeof ad.project === 'object' ? ad.project.title || `ID: ${ad.project._id || ad.project.id}` : `ID: ${ad.project}`}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic block mt-1">No connected project</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                        #{ad.order ?? 1}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            ad.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {ad.status ? ad.status.charAt(0).toUpperCase() + ad.status.slice(1) : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/dashboard/ads/edit/${id}`)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Advertisement"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(id, ad.title)}
                            disabled={isDeleting === id}
                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Advertisement"
                          >
                            {isDeleting === id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdList;
