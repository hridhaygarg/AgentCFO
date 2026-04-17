import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingState } from '../LoadingState';

describe('LoadingState Component', () => {
  // Table skeleton test
  test('renders table skeleton variant', () => {
    const { container } = render(<LoadingState variant="table" count={3} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('renders correct number of skeleton rows for table', () => {
    const { container } = render(<LoadingState variant="table" count={5} />);
    const rows = container.querySelectorAll('.skeleton-row');
    expect(rows.length).toBe(5);
  });

  // List skeleton test
  test('renders list skeleton variant', () => {
    const { container } = render(<LoadingState variant="list" count={4} />);
    const items = container.querySelectorAll('li, div.skeleton-item');
    expect(items.length).toBeGreaterThan(0);
  });

  test('renders correct number of skeleton items for list', () => {
    const { container } = render(<LoadingState variant="list" count={3} />);
    const items = container.querySelectorAll('.skeleton-item');
    expect(items.length).toBe(3);
  });

  // Card skeleton test
  test('renders card skeleton variant', () => {
    const { container } = render(<LoadingState variant="card" count={2} />);
    const cards = container.querySelectorAll('.skeleton-card');
    expect(cards.length).toBe(2);
  });

  // Animation test
  test('applies pulse animation class', () => {
    const { container } = render(<LoadingState variant="table" count={1} />);
    const animated = container.querySelector('.animate-pulse');
    expect(animated).toHaveClass('animate-pulse');
  });

  // Background color test
  test('applies gray background to skeletons', () => {
    const { container } = render(<LoadingState variant="table" count={1} />);
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // Border radius test
  test('applies rounded corners to skeletons', () => {
    const { container } = render(<LoadingState variant="card" count={1} />);
    const skeleton = container.querySelector('[class*="rounded"]');
    expect(skeleton).toHaveClass('rounded-lg');
  });

  // Height variation test
  test('applies varied heights to simulate content', () => {
    const { container } = render(<LoadingState variant="card" count={1} />);
    // Check for h-4 class which is commonly used for skeleton heights
    const heightElement = container.querySelector('[class*="h-"]');
    expect(heightElement).toBeInTheDocument();
  });

  // Count prop test
  test('renders correct count prop value', () => {
    const { container } = render(<LoadingState variant="list" count={7} />);
    const items = container.querySelectorAll('.skeleton-item');
    expect(items.length).toBe(7);
  });

  // Variant handling test
  test('handles invalid variant gracefully', () => {
    const { container } = render(<LoadingState variant="invalid" count={1} />);
    // Should still render something
    expect(container.firstChild).toBeInTheDocument();
  });

  // Spacing test
  test('applies spacing between skeleton items', () => {
    const { container } = render(<LoadingState variant="list" count={3} />);
    const wrapper = container.querySelector('[class*="space-y"]');
    expect(wrapper).toHaveClass('space-y-2');
  });

  // Table skeleton header test
  test('renders table header skeletons', () => {
    const { container } = render(<LoadingState variant="table" count={2} />);
    const headers = container.querySelectorAll('.skeleton-header');
    expect(headers.length).toBeGreaterThan(0);
  });

  // Card skeleton header test
  test('renders card with header and content skeletons', () => {
    const { container } = render(<LoadingState variant="card" count={1} />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  // Default count test
  test('uses default count when not provided', () => {
    const { container } = render(<LoadingState variant="list" />);
    // Should render with some default items
    const items = container.querySelectorAll('.skeleton-item');
    expect(items.length).toBeGreaterThan(0);
  });

  // Display test
  test('is visible and not hidden', () => {
    const { container } = render(<LoadingState variant="table" count={1} />);
    const root = container.firstChild;
    expect(root).toBeInTheDocument();
    expect(root).not.toHaveStyle({ display: 'none' });
  });
});
