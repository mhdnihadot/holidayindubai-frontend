import React from 'react';

const AddCategory: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Category</h2>
      <p className="text-gray-600 text-sm mb-6">Fill out the form below to create a new category.</p>
      
      <form className="max-w-xl flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter category name..." />
        </div>
        <div>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
