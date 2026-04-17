import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  onSort,
  onSelectRow,
  onExpandRow,
  selectable = false,
  expandable = false,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  className = '',
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });

  const handleSort = (accessor, sortable) => {
    if (!sortable) return;

    let newDirection = 'asc';
    if (sortConfig.column === accessor && sortConfig.direction === 'asc') {
      newDirection = 'desc';
    }

    setSortConfig({ column: accessor, direction: newDirection });
    if (onSort) {
      onSort(accessor, newDirection);
    }
  };

  const handleSelectRow = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    if (onSelectRow) {
      onSelectRow(Array.from(newSelected));
    }
  };

  const handleExpandRow = (rowId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
    if (onExpandRow) {
      onExpandRow(rowId);
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <span>No data available</span>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full rounded-lg shadow-sm border border-gray-200 border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
            )}
            {expandable && <th className="px-4 py-3 text-left w-12"></th>}
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-700 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => handleSort(column.accessor, column.sortable)}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortConfig.column === column.accessor && (
                    <span>
                      {sortConfig.direction === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`border-t border-gray-200 hover:bg-gray-100 transition-colors ${
                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="rounded"
                  />
                </td>
              )}
              {expandable && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleExpandRow(row.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="expand"
                  >
                    {expandedRows.has(row.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                  </button>
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={`${row.id || rowIndex}-${column.accessor}`}
                  className="px-4 py-3 text-sm text-gray-900"
                >
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

Table.displayName = 'Table';
