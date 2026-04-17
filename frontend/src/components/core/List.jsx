import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

export const List = ({
  items = [],
  onSelect,
  selectable = false,
  className = '',
}) => {
  const [selectedItems, setSelectedItems] = useState(
    selectable === 'single' ? null : new Set()
  );

  const handleSelectItem = (item) => {
    if (selectable === 'single') {
      setSelectedItems(item.id);
    } else if (selectable === 'multi') {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedItems(newSelected);
    }

    if (onSelect) {
      onSelect(item);
    }
  };

  const isSelected = (itemId) => {
    if (selectable === 'single') {
      return selectedItems === itemId;
    } else if (selectable === 'multi') {
      return selectedItems.has(itemId);
    }
    return false;
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        <span>No items available</span>
      </div>
    );
  }

  const getIconComponent = (iconName) => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <ul className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const IconComponent = item.icon
          ? LucideIcons[item.icon]
          : null;

        return (
          <li
            key={item.id}
            className={`flex items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer ${
              isSelected(item.id) ? 'selected bg-gray-100' : ''
            }`}
            onClick={() => handleSelectItem(item)}
          >
            <div className="flex items-center gap-3">
              {IconComponent && (
                <IconComponent className="h-4 w-4 text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
            </div>
            {item.action && (
              <button
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action.handler(item);
                }}
              >
                {item.action.label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

List.displayName = 'List';
