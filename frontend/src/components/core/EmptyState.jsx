import React from 'react';
import * as LucideIcons from 'lucide-react';

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const IconComponent = icon ? LucideIcons[icon] : null;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 space-y-4 ${className}`}>
      {IconComponent && (
        <IconComponent className="h-16 w-16 text-gray-400" />
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.handler}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
