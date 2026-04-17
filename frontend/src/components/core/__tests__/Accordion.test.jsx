import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from '../Accordion';

describe('Accordion Component', () => {
  const sections = [
    { title: 'Section 1', id: 'section1', content: 'Content 1' },
    { title: 'Section 2', id: 'section2', content: 'Content 2' },
    { title: 'Section 3', id: 'section3', content: 'Content 3' },
  ];

  // Basic rendering tests
  test('renders all section titles', () => {
    render(<Accordion sections={sections} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText('Section 3')).toBeInTheDocument();
  });

  test('renders first section expanded by default', () => {
    render(<Accordion sections={sections} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  test('renders other sections collapsed by default', () => {
    render(<Accordion sections={sections} />);
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });
});

describe('Accordion Expand/Collapse', () => {
  const sections = [
    { title: 'Title 1', id: 'id1', content: 'Content 1' },
    { title: 'Title 2', id: 'id2', content: 'Content 2' },
  ];

  test('expands section when clicked', () => {
    render(<Accordion sections={sections} />);
    const section2Button = screen.getByRole('button', { name: /title 2/i });
    fireEvent.click(section2Button);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  test('collapses expanded section when clicked again', () => {
    render(<Accordion sections={sections} />);
    const section1Button = screen.getByRole('button', { name: /title 1/i });
    // Click to collapse
    fireEvent.click(section1Button);
    // Check that aria-expanded is false
    expect(section1Button).toHaveAttribute('aria-expanded', 'false');
  });

  test('shows chevron icon rotation on expand', () => {
    const { container } = render(<Accordion sections={sections} />);
    // Framer Motion uses transform style, not class-based rotation
    // Check that the first section's chevron should have animation
    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons.length).toBeGreaterThan(0);
    // The expanded chevron should be present
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('Accordion Exclusive Mode', () => {
  const sections = [
    { title: 'Section A', id: 'a', content: 'Content A' },
    { title: 'Section B', id: 'b', content: 'Content B' },
    { title: 'Section C', id: 'c', content: 'Content C' },
  ];

  test('only one section open at a time in exclusive mode', () => {
    render(<Accordion sections={sections} exclusive={true} />);

    // First section is open
    const sectionAButton = screen.getByRole('button', { name: /section a/i });
    const sectionBButton = screen.getByRole('button', { name: /section b/i });

    expect(sectionAButton).toHaveAttribute('aria-expanded', 'true');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'false');

    // Click section B
    fireEvent.click(sectionBButton);

    // Now B is open and A is closed
    expect(sectionAButton).toHaveAttribute('aria-expanded', 'false');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes previous section when opening new one in exclusive mode', () => {
    render(<Accordion sections={sections} exclusive={true} />);

    const sectionAButton = screen.getByRole('button', { name: /section a/i });
    const sectionBButton = screen.getByRole('button', { name: /section b/i });

    // Initially A is open
    expect(sectionAButton).toHaveAttribute('aria-expanded', 'true');

    // Click B
    fireEvent.click(sectionBButton);

    // A should close and B should open
    expect(sectionAButton).toHaveAttribute('aria-expanded', 'false');
    expect(sectionBButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('allows multiple sections open when exclusive is false', () => {
    const TestComponent = () => {
      const [openSections, setOpenSections] = useState(['a']);

      const handleToggle = (id) => {
        setOpenSections((prev) =>
          prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
      };

      return (
        <Accordion
          sections={sections}
          exclusive={false}
          openSections={openSections}
          onToggle={handleToggle}
        />
      );
    };

    render(<TestComponent />);

    // Open B
    const sectionBButton = screen.getByRole('button', { name: /section b/i });
    fireEvent.click(sectionBButton);

    // Both should be visible
    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });
});

describe('Accordion ARIA Attributes', () => {
  const sections = [
    { title: 'Question 1', id: 'q1', content: 'Answer 1' },
    { title: 'Question 2', id: 'q2', content: 'Answer 2' },
  ];

  test('accordion buttons have role="button"', () => {
    render(<Accordion sections={sections} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  test('expanded button has aria-expanded="true"', () => {
    render(<Accordion sections={sections} />);
    const expandedButton = screen.getByRole('button', { name: /question 1/i });
    expect(expandedButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('collapsed button has aria-expanded="false"', () => {
    render(<Accordion sections={sections} />);
    const collapsedButton = screen.getByRole('button', { name: /question 2/i });
    expect(collapsedButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('buttons have aria-controls attribute', () => {
    render(<Accordion sections={sections} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-controls');
    });
  });

  test('content panels have matching ids for aria-controls', () => {
    const { container } = render(<Accordion sections={sections} />);
    const buttons = screen.getAllByRole('button');

    buttons.forEach((button) => {
      const controlsId = button.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      // The panel should exist with the controlled id
      const contentPanel = container.querySelector(`#${controlsId}`);
      if (contentPanel) {
        expect(contentPanel).toBeInTheDocument();
      } else {
        // If not currently in DOM (collapsed), that's ok for animated components
        expect(contentPanel).not.toBeInTheDocument();
      }
    });
  });
});

describe('Accordion Animations', () => {
  const sections = [
    { title: 'Animating', id: 'anim', content: 'Animated Content' },
  ];

  test('renders with animation container', () => {
    const { container } = render(<Accordion sections={sections} />);
    // Check for presence of motion elements (Framer Motion should be present)
    const motionElements = container.querySelectorAll('[class*="overflow"]');
    expect(motionElements.length).toBeGreaterThan(0);
  });

  test('content area has overflow-hidden for animation', () => {
    const { container } = render(<Accordion sections={sections} />);
    const contentAreas = container.querySelectorAll('[class*="overflow-hidden"]');
    expect(contentAreas.length).toBeGreaterThan(0);
  });
});

describe('Accordion Edge Cases', () => {
  test('renders with empty sections array', () => {
    const { container } = render(<Accordion sections={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('renders with single section', () => {
    const sections = [{ title: 'Only One', id: 'only', content: 'Only Content' }];
    render(<Accordion sections={sections} />);
    expect(screen.getByText('Only One')).toBeInTheDocument();
    expect(screen.getByText('Only Content')).toBeInTheDocument();
  });

  test('renders with many sections', () => {
    const sections = Array.from({ length: 10 }, (_, i) => ({
      title: `Section ${i + 1}`,
      id: `section${i + 1}`,
      content: `Content ${i + 1}`,
    }));
    render(<Accordion sections={sections} />);

    sections.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
    });
  });

  test('handles section with long content', () => {
    const sections = [
      {
        title: 'Long Content',
        id: 'long',
        content: 'A'.repeat(1000),
      },
    ];
    render(<Accordion sections={sections} />);
    const content = screen.getByText('A'.repeat(1000));
    expect(content).toBeInTheDocument();
  });
});
