import React, { useCallback, useMemo } from 'react';

export const Tabs = ({ tabs, activeTab, onChange, children, className = '' }) => {
  const childrenArray = React.Children.toArray(children);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event) => {
      if (!onChange) return;

      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          onChange(tabs[nextIndex].id);
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          onChange(tabs[nextIndex].id);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          // Tab is already selected, just prevent default
          break;
        default:
          break;
      }
    },
    [tabs, activeTab, onChange]
  );

  // Get the active content
  const activeContent = useMemo(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    return activeIndex >= 0 ? childrenArray[activeIndex] : null;
  }, [tabs, activeTab, childrenArray]);

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        role="tablist"
        className="flex border-b border-gray-200"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange && onChange(tab.id)}
            onKeyDown={handleKeyDown}
            className={`
              px-4 py-2 font-medium transition-colors whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="transition-opacity duration-200"
      >
        {activeContent}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';
