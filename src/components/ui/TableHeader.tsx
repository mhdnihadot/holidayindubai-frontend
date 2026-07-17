import React from 'react';

interface TableHeaderProps {
  /**
   * Title text or custom React element for the left side of the header.
   */
  title?: React.ReactNode;

  /**
   * Optional custom elements to render next to the title (e.g., status badges, item counts).
   */
  leftContent?: React.ReactNode;

  /**
   * Optional custom elements for the right side of the header (e.g., search bars, action buttons, filter selectors).
   */
  rightContent?: React.ReactNode;

  /**
   * Additional tailwind classes for custom styling overrides on the header container wrapper.
   */
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  leftContent,
  rightContent,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3  ${className}`}>
      {/* Left section containing title and supplemental details */}
      <div className="flex items-center gap-3">
        {title && typeof title === 'string' ? (
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        ) : (
          title
        )}
        {leftContent}
      </div>

      {/* Right section containing page controls */}
      <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
        {rightContent}
      </div>
    </div>
  );
};
