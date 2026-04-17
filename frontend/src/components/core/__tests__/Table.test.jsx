import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../Table';

describe('Table Component', () => {
  // Test data
  const mockColumns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: false },
    { header: 'Role', accessor: 'role', sortable: true },
  ];

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  // Basic rendering tests
  test('renders table with correct columns', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  test('renders all data rows', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  test('renders table with correct structure', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  // Sorting tests
  test('calls onSort when sortable column header is clicked', () => {
    const handleSort = jest.fn();
    render(<Table columns={mockColumns} data={mockData} onSort={handleSort} />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  test('changes sort direction on subsequent clicks', () => {
    const handleSort = jest.fn();
    render(<Table columns={mockColumns} data={mockData} onSort={handleSort} />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    fireEvent.click(nameHeader);
    expect(handleSort).toHaveBeenNthCalledWith(2, 'name', 'desc');
  });

  test('does not call onSort for non-sortable columns', () => {
    const handleSort = jest.fn();
    render(<Table columns={mockColumns} data={mockData} onSort={handleSort} />);
    const emailHeader = screen.getByText('Email');
    fireEvent.click(emailHeader);
    expect(handleSort).not.toHaveBeenCalled();
  });

  // Row selection tests
  test('renders checkboxes for row selection', () => {
    render(<Table columns={mockColumns} data={mockData} selectable={true} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  test('calls onSelectRow when checkbox is clicked', () => {
    const handleSelectRow = jest.fn();
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        selectable={true}
        onSelectRow={handleSelectRow}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click first data row checkbox
    expect(handleSelectRow).toHaveBeenCalled();
  });

  test('does not render checkboxes when selectable is false', () => {
    const { container } = render(
      <Table columns={mockColumns} data={mockData} selectable={false} />
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(0);
  });

  // Expandable rows tests
  test('renders expand button when expandable is true', () => {
    render(<Table columns={mockColumns} data={mockData} expandable={true} />);
    const expandButtons = screen.getAllByRole('button');
    expect(expandButtons.length).toBeGreaterThan(0);
  });

  test('calls onExpandRow when expand button is clicked', () => {
    const handleExpandRow = jest.fn();
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        expandable={true}
        onExpandRow={handleExpandRow}
      />
    );
    const expandButton = screen.getAllByRole('button')[0];
    fireEvent.click(expandButton);
    expect(handleExpandRow).toHaveBeenCalled();
  });

  // Empty state test
  test('renders empty state when data array is empty', () => {
    render(<Table columns={mockColumns} data={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  // Striped rows test
  test('applies alternating background colors to rows', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('bg-white');
    expect(rows[1]).toHaveClass('bg-gray-50');
  });

  // Hover effects test
  test('applies hover classes to rows', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} />);
    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      expect(row).toHaveClass('hover:bg-gray-100');
    });
  });

  // Pagination controls test
  test('renders pagination controls when pagination is true', () => {
    render(
      <Table
        columns={mockColumns}
        data={mockData}
        pagination={true}
        currentPage={1}
        totalPages={5}
      />
    );
    expect(screen.getByText(/page/i)).toBeInTheDocument();
  });

  // Responsive table styling test
  test('applies Tailwind styling classes', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} />);
    const table = container.querySelector('table');
    expect(table).toHaveClass('rounded-lg', 'shadow-sm');
  });

  test('applies border styling', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} />);
    const table = container.querySelector('table');
    expect(table).toHaveClass('border-gray-200');
  });
});
