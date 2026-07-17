import React from 'react';

export interface ColumnConfig<T> {
  key: string;
  header: React.ReactNode;
  className?: string; // Custom class for header and data cells in this column
  render?: (item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  keyExtractor: (item: T, index: number) => string;
  tableClassName?: string;
  headerRowClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
}

export function Table<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found.',
  keyExtractor,
  tableClassName = 'w-full  text-left border-collapse',
  headerRowClassName = 'bg-[#fafafa] dark:bg-slate-800/30 border-b border-gray-100 dark:border-gray-800/50',
  rowClassName = 'border-b  border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors',
}: TableProps<T>) {
  return (
    <div className="w-full  border rounded-lg border-gray-100 overflow-x-auto">
      <table className={tableClassName}>
        <thead>
          <tr className={headerRowClassName}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3.5 px-6 font-semibold text-sm text-gray-800 dark:text-gray-400 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Render 5 organic skeleton placeholder rows matching columns exactly
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`} className="border-b border-gray-100 dark:border-gray-800/50">
                {columns.map((col, colIndex) => {
                  // Vary widths organically for visual interest
                  const widthClass =
                    colIndex === 0 ? 'w-3/4' :
                      colIndex === 1 ? 'w-1/2' :
                        colIndex === 2 ? 'w-1/3' : 'w-1/4';

                  return (
                    <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className={`py-4 px-6 ${col.className || ''}`}>
                      <div className={`h-4 bg-gray-200/80 dark:bg-slate-700/60 rounded animate-pulse ${widthClass} inline-block`} />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const currentKey = keyExtractor(item, index);
              const customRowClass = typeof rowClassName === 'function' ? rowClassName(item, index) : rowClassName;

              return (
                <tr key={currentKey} className={customRowClass}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2.5 px-6 text-sm ${col.className || ''}`}
                    >
                      {col.render ? col.render(item, index) : (item[col.key as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
