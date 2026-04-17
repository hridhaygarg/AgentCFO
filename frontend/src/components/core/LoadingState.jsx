import React from 'react';

export const LoadingState = ({
  variant = 'table',
  count = 3,
  className = '',
}) => {
  const renderTableSkeleton = () => {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="skeleton-header flex gap-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="skeleton-row flex gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  };

  const renderListSkeleton = () => {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-item flex gap-4 animate-pulse p-4 bg-gray-50 rounded-lg"
          >
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
    );
  };

  const renderCardSkeleton = () => {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="skeleton-card bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse space-y-4"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  switch (variant) {
    case 'table':
      return renderTableSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'card':
      return renderCardSkeleton();
    default:
      return renderListSkeleton();
  }
};

LoadingState.displayName = 'LoadingState';
