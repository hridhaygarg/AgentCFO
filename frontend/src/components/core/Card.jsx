import React, { forwardRef } from 'react';

const paddingSizes = {
  sm: 'p-2',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef(
  ({ children, className = '', padding = 'md', ...rest }, ref) => {
    const paddingClass = paddingSizes[padding] || paddingSizes.md;
    const baseClasses =
      'bg-white rounded-lg shadow-md border border-gray-200';

    const combinedClasses = `
      ${baseClasses}
      ${paddingClass}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={combinedClasses} {...rest}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card.Header subcomponent
const CardHeader = forwardRef(({ children, className = '', ...rest }, ref) => {
  const baseClasses =
    'flex items-center px-4 py-3 border-b border-gray-200';

  const combinedClasses = `
    ${baseClasses}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={combinedClasses} {...rest}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'Card.Header';

// Card.Body subcomponent
const CardBody = forwardRef(({ children, className = '', ...rest }, ref) => {
  const baseClasses = 'px-4 py-3';

  const combinedClasses = `
    ${baseClasses}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={combinedClasses} {...rest}>
      {children}
    </div>
  );
});

CardBody.displayName = 'Card.Body';

// Card.Footer subcomponent
const CardFooter = forwardRef(({ children, className = '', ...rest }, ref) => {
  const baseClasses =
    'flex items-center px-4 py-3 border-t border-gray-200';

  const combinedClasses = `
    ${baseClasses}
    ${className}
  `.trim();

  return (
    <div ref={ref} className={combinedClasses} {...rest}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'Card.Footer';

// Compound component pattern
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
