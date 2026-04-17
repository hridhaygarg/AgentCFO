import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  className = '',
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleInputChange = (e) => {
    setInputPage(parseInt(e.target.value, 10) || '');
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(inputPage, 10);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        setInputPage(page);
      }
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const rangeSize = 5;
    let startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
    let endPage = Math.min(totalPages, startPage + rangeSize - 1);

    if (endPage - startPage < rangeSize - 1) {
      startPage = Math.max(1, endPage - rangeSize + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-between gap-4 flex-wrap ${className}`}>
      <div className="flex gap-2">
        <button
          onClick={handlePreviousClick}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex gap-1">
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="page-input" className="text-sm text-gray-600">
          Go to page:
        </label>
        <input
          id="page-input"
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </nav>
  );
};

Pagination.displayName = 'Pagination';
