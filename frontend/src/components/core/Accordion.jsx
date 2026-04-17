import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({
  sections = [],
  exclusive = true,
  openSections = undefined,
  onToggle = undefined,
}) => {
  // Internal state if not controlled
  const [internalOpenSections, setInternalOpenSections] = useState(() => {
    if (sections.length > 0) {
      return [sections[0].id];
    }
    return [];
  });

  // Use provided state or internal state
  const isControlled = openSections !== undefined;
  const activeOpenSections = isControlled ? openSections : internalOpenSections;

  const handleToggle = useCallback(
    (id) => {
      if (isControlled) {
        // Use controlled callback
        if (onToggle) {
          onToggle(id);
        }
      } else {
        // Uncontrolled state
        setInternalOpenSections((prev) => {
          if (exclusive) {
            // Only one open at a time
            return prev.includes(id) ? [] : [id];
          } else {
            // Multiple open at a time
            return prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
          }
        });
      }
    },
    [exclusive, isControlled, onToggle]
  );

  return (
    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
      {sections.map((section) => {
        const isOpen = activeOpenSections.includes(section.id);

        return (
          <div key={section.id}>
            {/* Header/Trigger */}
            <button
              role="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${section.id}`}
              onClick={() => handleToggle(section.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left font-medium text-gray-900"
            >
              <span>{section.title}</span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${section.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gray-50 text-gray-700">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = 'Accordion';
