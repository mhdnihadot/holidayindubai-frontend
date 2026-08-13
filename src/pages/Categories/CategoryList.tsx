import React, { useState, useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import type { Category } from '@/services/category.service';

const CategoryList: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategories(response.data || response || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setMessage('');
    try {
      // Calling sync without body. Backend will scan projects and update categories.
      await categoryService.sync([] as any); 
      setMessage('Categories synchronized successfully from projects!');
      fetchCategories();
    } catch (error) {
      console.error('Failed to sync categories:', error);
      setMessage('Failed to sync categories. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Categories Sync</h2>
            <p className="text-gray-600 text-sm">
              Categories are automatically detected from the projects you create. 
              Click the button below to scan all projects and update the available categories list.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Categories'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Categories List</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found. Click sync to generate categories from your projects.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                  <th className="px-6 py-3 font-medium">Category Name</th>
                  <th className="px-6 py-3 font-medium">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category, index) => (
                  <tr key={category._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{category._id || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
