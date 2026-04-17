import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../EmptyState';

describe('EmptyState Component', () => {
  // Basic rendering tests
  test('renders icon when provided', () => {
    const { container } = render(
      <EmptyState icon="Inbox" title="No Messages" description="You have no messages" />
    );
    // Check for SVG (Lucide icon)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  test('renders title text', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="No Data Available"
        description="There is no data to display"
      />
    );
    expect(screen.getByText('No Data Available')).toBeInTheDocument();
  });

  test('renders description text', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="No Results"
        description="Your search returned no results"
      />
    );
    expect(screen.getByText('Your search returned no results')).toBeInTheDocument();
  });

  test('renders with centered layout', () => {
    const { container } = render(
      <EmptyState
        icon="Inbox"
        title="Empty"
        description="Nothing here"
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  test('applies vertical spacing classes', () => {
    const { container } = render(
      <EmptyState
        icon="Inbox"
        title="Empty"
        description="Nothing here"
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('space-y-4');
  });

  // Action button tests
  test('renders action button when provided', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState
        icon="Inbox"
        title="No Data"
        description="Add something new"
        action={{ label: 'Create New', handler: mockAction }}
      />
    );
    const button = screen.getByText('Create New');
    expect(button).toBeInTheDocument();
  });

  test('calls action handler when button is clicked', () => {
    const mockAction = jest.fn();
    render(
      <EmptyState
        icon="Plus"
        title="Empty"
        description="Add an item"
        action={{ label: 'Add Item', handler: mockAction }}
      />
    );
    const button = screen.getByText('Add Item');
    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalled();
  });

  test('does not render button when action is not provided', () => {
    render(
      <EmptyState icon="Inbox" title="Empty" description="No action" />
    );
    // Should not find any button or only find navigation buttons if any
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  // Icon variants test
  test('renders different Lucide icons', () => {
    const { rerender, container: container1 } = render(
      <EmptyState
        icon="Inbox"
        title="No Messages"
        description="You have no messages"
      />
    );
    let svg = container1.querySelector('svg');
    expect(svg).toBeInTheDocument();

    rerender(
      <EmptyState
        icon="Settings"
        title="No Settings"
        description="No settings available"
      />
    );
  });

  // Title size and styling test
  test('applies correct styling to title', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="Test Title"
        description="Test description"
      />
    );
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-lg', 'font-semibold');
  });

  // Description styling test
  test('applies correct styling to description', () => {
    render(
      <EmptyState
        icon="Inbox"
        title="Title"
        description="Test Description"
      />
    );
    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('text-gray-500');
  });

  // Responsive padding test
  test('applies padding classes for centered content', () => {
    const { container } = render(
      <EmptyState
        icon="Inbox"
        title="Empty"
        description="No content"
      />
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('py-12', 'px-4');
  });

  // Icon size test
  test('renders icon with appropriate size', () => {
    const { container } = render(
      <EmptyState
        icon="Inbox"
        title="Empty"
        description="Nothing"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-16', 'w-16');
  });

  // Icon color test
  test('applies gray color to icon', () => {
    const { container } = render(
      <EmptyState
        icon="Inbox"
        title="Empty"
        description="Nothing"
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-gray-400');
  });
});
