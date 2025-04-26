'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDown
} from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  keyField: string;
  pagination?: {
    pageSize: number;
    totalCount: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: string | null;
    direction: 'asc' | 'desc' | null;
    onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  };
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  keyField,
  pagination,
  sorting
}: DataTableProps<T>) {
  type ValueType = string | number | boolean | null | undefined;
  const [hoveredRowId, setHoveredRowId] = useState<ValueType>(null);

  // ソート状態の切り替え
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !sorting) return;

    const field = column.accessorKey;
    const direction =
      sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc';

    sorting.onSortChange(field, direction);
  };

  // ページネーション関連の計算
  const totalPages = pagination
    ? Math.ceil(pagination.totalCount / pagination.pageSize)
    : 1;

  const currentPage = pagination?.currentPage || 1;

  return (
    <div className="table-container">
      <div className="border rounded-md">
        <table className="table">
          <thead className="table-header">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`table-header-cell ${column.sortable ? 'table-header-cell-sortable' : ''}`}
                >
                  {column.sortable && sorting ? (
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort(column)}
                    >
                      {column.header}
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="table-empty"
                >
                  データがありません
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className={`table-row ${
                    onRowClick ? 'table-row-clickable' : ''
                  } ${
                    hoveredRowId === item[keyField] ? 'table-row-hovered' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(item)}
                  onMouseEnter={() => setHoveredRowId(item[keyField] as ValueType)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  {columns.map((column, cellIndex) => (
                    <td key={cellIndex} className="table-cell">
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.accessorKey] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="table-pagination">
          <div className="table-pagination-info">
            全 {pagination.totalCount} 件中 {(currentPage - 1) * pagination.pageSize + 1} - {Math.min(
              currentPage * pagination.pageSize,
              pagination.totalCount
            )} 件を表示
          </div>
          <div className="table-pagination-controls">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <span className="table-pagination-text">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
