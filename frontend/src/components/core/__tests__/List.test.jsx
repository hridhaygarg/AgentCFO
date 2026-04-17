import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { List } from '../List';

describe('List Component', () => {
  // Test data
  const mockItems = [
    { id: 1, label: 'First Item' },
    { id: 2, label: 'Second Item' },
    { id: 3, label: 'Third Item' },
  ];

  const mockItemsWithIcons = [
    { id: 1, label: 'Home', icon: 'Home' },
    { id: 2, label: 'Settings', icon: 'Settings' },
    { id: 3, label: 'Profile', icon: 'User' },
  ];

  const mockItemsWithActions = [
    { id: 1, label: 'Item 1', action: { label: 'Delete', handler: jest.fn() } },
    { id: 2, label: 'Item 2', action: { label: 'Edit', handler: jest.fn() } },
  ];

  // Basic rendering tests
  test('renders list with items', () => {
    render(<List items={mockItems} />);
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getByText('Third Item')).toBeInTheDocument();
  });

  test('renders correct number of items', () => {
    const { container } = render(<List items={mockItems} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });

  test('renders ul element', () => {
    const { container } = render(<List items={mockItems} />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  // Icon tests
  test('renders items with icons', () => {
    render(<List items={mockItemsWithIcons} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  // Click handler tests
  test('calls onSelect when item is clicked', () => {
    const handleSelect = jest.fn();
    render(<List items={mockItems} onSelect={handleSelect} />);
    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  test('calls onSelect with correct item data', () => {
    const handleSelect = jest.fn();
    render(<List items={mockItems} onSelect={handleSelect} />);
    const secondItem = screen.getByText('Second Item');
    fireEvent.click(secondItem);
    expect(handleSelect).toHaveBeenCalledWith(mockItems[1]);
  });

  // Selection support tests
  test('handles single selection', () => {
    const { container } = render(
      <List items={mockItems} selectable="single" />
    );
    const items = container.querySelectorAll('li');
    fireEvent.click(items[0]);
    expect(items[0]).toHaveClass('selected');
  });

  test('allows only one selected item in single mode', () => {
    const { container } = render(
      <List items={mockItems} selectable="single" />
    );
    const items = container.querySelectorAll('li');
    fireEvent.click(items[0]);
    fireEvent.click(items[1]);
    expect(items[0]).not.toHaveClass('selected');
    expect(items[1]).toHaveClass('selected');
  });

  test('handles multi selection', () => {
    const { container } = render(
      <List items={mockItems} selectable="multi" />
    );
    const items = container.querySelectorAll('li');
    fireEvent.click(items[0]);
    fireEvent.click(items[1]);
    expect(items[0]).toHaveClass('selected');
    expect(items[1]).toHaveClass('selected');
  });

  test('allows multiple selected items in multi mode', () => {
    const { container } = render(
      <List items={mockItems} selectable="multi" />
    );
    const items = container.querySelectorAll('li');
    fireEvent.click(items[0]);
    fireEvent.click(items[1]);
    fireEvent.click(items[2]);
    expect(items[0]).toHaveClass('selected');
    expect(items[1]).toHaveClass('selected');
    expect(items[2]).toHaveClass('selected');
  });

  // Hover effects test
  test('applies hover effects to items', () => {
    const { container } = render(<List items={mockItems} />);
    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      expect(item).toHaveClass('hover:bg-gray-100');
    });
  });

  // Action button tests
  test('renders action button when action prop is provided', () => {
    render(<List items={mockItemsWithActions} />);
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
  });

  test('calls action handler when action button is clicked', () => {
    const mockHandler = jest.fn();
    const itemsWithAction = [
      { id: 1, label: 'Item 1', action: { label: 'Delete', handler: mockHandler } },
    ];
    render(<List items={itemsWithAction} />);
    const actionButton = screen.getByText('Delete');
    fireEvent.click(actionButton);
    expect(mockHandler).toHaveBeenCalled();
  });

  // Empty list test
  test('renders empty state for empty items array', () => {
    render(<List items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  // Styling tests
  test('applies Tailwind styling classes', () => {
    const { container } = render(<List items={mockItems} />);
    const list = container.querySelector('ul');
    expect(list).toHaveClass('space-y-1');
  });

  test('applies border and rounded classes to items', () => {
    const { container } = render(<List items={mockItems} />);
    const items = container.querySelectorAll('li');
    items.forEach((item) => {
      expect(item).toHaveClass('rounded-md');
    });
  });
});
