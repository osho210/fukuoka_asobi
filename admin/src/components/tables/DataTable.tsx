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
  editable?: boolean; // 編集可能かどうか
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
  // 値の型定義
  type ValueType = string | number | boolean | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="admin-table-container">
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.accessorKey || index}
                  className={column.sortable ? 'cursor-pointer' : ''}
                >
                  {column.sortable && sorting ? (
                    <button
                      className="admin-flex admin-items-center"
                      onClick={() => handleSort(column)}
                    >
                      {column.header}
                      <ArrowUpDown className="w-4 h-4 admin-ml-1" />
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
                  className="admin-table-empty"
                >
                  データがありません
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className={onRowClick ? 'admin-table-clickable' : ''}
                  onClick={() => onRowClick && onRowClick(item)}
                  onMouseEnter={() => setHoveredRowId(item[keyField] as ValueType)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  {columns.map((column, cellIndex) => {
                    // ネストされたプロパティへのアクセスをサポート（例：user.username）
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const getValue = (obj: Record<string, any>, path: string) => {
                      const keys = path.split('.');
                      return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : '', obj);
                    };

                    const value = getValue(item, column.accessorKey);

                    return (
                      <td key={cellIndex}>
                        {column.cell ? column.cell(item) : String(value || '')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="admin-pagination">
          <div className="admin-pagination-info">
            全 {pagination.totalCount} 件中 {(currentPage - 1) * pagination.pageSize + 1} - {Math.min(
              currentPage * pagination.pageSize,
              pagination.totalCount
            )} 件を表示
          </div>
          <div className="admin-pagination-controls">
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
            <span className="admin-pagination-text">
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
