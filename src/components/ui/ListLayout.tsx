import React from 'react';
import { TableHeader } from './TableHeader';
import { Table, type ColumnConfig } from './Table';
import { Pagination } from './Pagination';

interface ListLayoutProps<T> {
  /**
   * Title text or custom React node for the header panel
   */
  title?: React.ReactNode;

  /**
   * Optional custom content to render next to the title
   */
  leftHeaderContent?: React.ReactNode;

  /**
   * Optional controls (search input, action buttons) to render on the right of the header
   */
  rightHeaderContent?: React.ReactNode;

  // Table configurations
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T, index: number) => string;
  tableClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);

  // Pagination configurations
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;

  /**
   * Optional root container class list overrides
   */
  className?: string;
}

export function ListLayout<T>({
  title,
  leftHeaderContent,
  rightHeaderContent,
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found.',
  keyExtractor,
  tableClassName,
  rowClassName,
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  className = '',
}: ListLayoutProps<T>) {
  return (
    <div className={`bg-white dark:bg-[#1e293b] transition-colors overflow-hidden ${className}`}>
      {/* Header Controls Panel */}
      <TableHeader
        title={title}
        leftContent={leftHeaderContent}
        rightContent={rightHeaderContent}
      />

      {/* Main Records Table */}
      <Table
        data={data}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        keyExtractor={keyExtractor}
        tableClassName={tableClassName}
        rowClassName={rowClassName}
      />

      {/* Interactive Pagination controls */}
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limit={limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
export type { ColumnConfig };
