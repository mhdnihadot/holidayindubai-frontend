import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {description}
        </p>
      )}
    </div>
  );
};
