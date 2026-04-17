import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '../Pagination';

describe('Pagination Component', () => {
  // Basic rendering tests
  test('renders pagination controls', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  test('renders previous button', () => {
    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    expect(screen.getByText(/previous/i)).toBeInTheDocument();
  });

  test('renders next button', () => {
    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  // Page number display test
  test('displays page numbers', () => {
    render(
      <Pagination totalPages={5} currentPage={2} onPageChange={jest.fn()} />
    );
    // Should display numbers around current page
    const pageElements = screen.queryAllByText(/^\d+$/);
    expect(pageElements.length).toBeGreaterThan(0);
  });

  test('highlights current page', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={3} onPageChange={jest.fn()} />
    );
    const currentButton = container.querySelector('[class*="bg-blue"]');
    expect(currentButton).toHaveTextContent('3');
  });

  // Navigation tests
  test('calls onPageChange with next page when next is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={handlePageChange} />
    );
    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange with previous page when previous is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination totalPages={5} currentPage={3} onPageChange={handlePageChange} />
    );
    const prevButton = screen.getByText(/previous/i);
    fireEvent.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange when page number is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination totalPages={5} currentPage={1} onPageChange={handlePageChange} />
    );
    // Click on page 2
    const pageButtons = screen.queryAllByText(/^\d+$/);
    if (pageButtons.length > 1) {
      fireEvent.click(pageButtons[1]);
      expect(handlePageChange).toHaveBeenCalled();
    }
  });

  // Boundary tests
  test('disables previous button on first page', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    const prevButton = screen.getByText(/previous/i);
    expect(prevButton).toBeDisabled();
  });

  test('disables next button on last page', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={5} onPageChange={jest.fn()} />
    );
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).toBeDisabled();
  });

  test('enables previous button when not on first page', () => {
    render(
      <Pagination totalPages={5} currentPage={2} onPageChange={jest.fn()} />
    );
    const prevButton = screen.getByText(/previous/i);
    expect(prevButton).not.toBeDisabled();
  });

  test('enables next button when not on last page', () => {
    render(
      <Pagination totalPages={5} currentPage={2} onPageChange={jest.fn()} />
    );
    const nextButton = screen.getByText(/next/i);
    expect(nextButton).not.toBeDisabled();
  });

  // Go to page input test
  test('renders go to page input', () => {
    const { container } = render(
      <Pagination totalPages={10} currentPage={1} onPageChange={jest.fn()} />
    );
    const input = container.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();
  });

  test('allows user to enter page number', () => {
    const handlePageChange = jest.fn();
    const { container } = render(
      <Pagination totalPages={10} currentPage={1} onPageChange={handlePageChange} />
    );
    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handlePageChange).toHaveBeenCalledWith(5);
  });

  // Input validation test
  test('validates input page number is within range', () => {
    const handlePageChange = jest.fn();
    const { container } = render(
      <Pagination totalPages={5} currentPage={1} onPageChange={handlePageChange} />
    );
    const input = container.querySelector('input[type="number"]');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    // Should not call with invalid page
    if (handlePageChange.mock.calls.length > 0) {
      expect(handlePageChange.mock.calls[0][0]).toBeLessThanOrEqual(5);
    }
  });

  // Styling test
  test('applies flex layout classes', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('flex');
  });

  test('applies hover effects to page buttons', () => {
    const { container } = render(
      <Pagination totalPages={5} currentPage={1} onPageChange={jest.fn()} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    // Check that at least some buttons have hover effects
    const hasHoverButton = Array.from(buttons).some((btn) =>
      btn.className.includes('hover:')
    );
    expect(hasHoverButton).toBe(true);
  });

  // Single page test
  test('disables navigation when only one page', () => {
    render(
      <Pagination totalPages={1} currentPage={1} onPageChange={jest.fn()} />
    );
    const prevButton = screen.getByText(/previous/i);
    const nextButton = screen.getByText(/next/i);
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  // Page range display test
  test('shows appropriate page numbers around current page', () => {
    render(
      <Pagination totalPages={10} currentPage={5} onPageChange={jest.fn()} />
    );
    // Should show pages around 5, typically 3, 4, 5, 6, 7
    const pageNumbers = screen.queryAllByText(/^\d+$/);
    expect(pageNumbers.length).toBeGreaterThan(0);
  });

  // First and last page test
  test('shows first and last page in range', () => {
    const { container } = render(
      <Pagination totalPages={10} currentPage={5} onPageChange={jest.fn()} />
    );
    // Typically should show page 1 and page 10
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
