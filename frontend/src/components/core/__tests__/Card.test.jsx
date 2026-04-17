import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../Card';

describe('Card Component', () => {
  // Basic rendering tests
  test('renders card with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('applies white background and shadow classes', () => {
    const { container } = render(<Card>Content</Card>);
    const cardElement = container.querySelector('[class*="bg-white"]');
    expect(cardElement).toHaveClass('bg-white');
    expect(cardElement).toHaveClass('shadow-md');
  });

  test('renders with default padding', () => {
    const { container } = render(<Card>Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('p-6');
  });

  test('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('custom-class');
  });

  test('applies md padding prop', () => {
    const { container } = render(<Card padding="md">Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('p-6');
  });

  test('applies lg padding prop', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('p-8');
  });

  test('applies sm padding prop', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('p-2');
  });
});

describe('Card.Header Component', () => {
  test('renders Card.Header with children', () => {
    render(
      <Card>
        <Card.Header>Header Content</Card.Header>
      </Card>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  test('applies flex and border-bottom classes to header', () => {
    const { container } = render(
      <Card>
        <Card.Header>Header</Card.Header>
      </Card>
    );
    const headerElement = container.querySelector('div[class*="flex"]');
    expect(headerElement).toHaveClass('flex');
    expect(headerElement).toHaveClass('items-center');
    expect(headerElement).toHaveClass('border-b');
  });

  test('applies correct padding to header', () => {
    const { container } = render(
      <Card>
        <Card.Header>Header</Card.Header>
      </Card>
    );
    const headerElement = container.querySelector('div[class*="border-b"]');
    expect(headerElement).toHaveClass('px-4');
    expect(headerElement).toHaveClass('py-3');
  });
});

describe('Card.Body Component', () => {
  test('renders Card.Body with children', () => {
    render(
      <Card>
        <Card.Body>Body Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  test('applies padding to body', () => {
    const { container } = render(
      <Card>
        <Card.Body>Body</Card.Body>
      </Card>
    );
    // The body element itself should have px-4 and py-3 classes
    const allDivs = container.querySelectorAll('div');
    let bodyElement = null;
    for (const div of allDivs) {
      if (div.textContent === 'Body' && !div.querySelector('div')) {
        bodyElement = div;
        break;
      }
    }
    expect(bodyElement).toHaveClass('px-4');
    expect(bodyElement).toHaveClass('py-3');
  });
});

describe('Card.Footer Component', () => {
  test('renders Card.Footer with children', () => {
    render(
      <Card>
        <Card.Footer>Footer Content</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  test('applies flex and border-top classes to footer', () => {
    const { container } = render(
      <Card>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    const footerElement = container.querySelector('div[class*="border-t"]');
    expect(footerElement).toHaveClass('flex');
    expect(footerElement).toHaveClass('items-center');
    expect(footerElement).toHaveClass('border-t');
  });

  test('applies correct padding to footer', () => {
    const { container } = render(
      <Card>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    const footerElement = container.querySelector('div[class*="border-t"]');
    expect(footerElement).toHaveClass('px-4');
    expect(footerElement).toHaveClass('py-3');
  });
});

describe('Card Compound Component Pattern', () => {
  test('renders card with header, body, and footer', () => {
    render(
      <Card>
        <Card.Header>Card Header</Card.Header>
        <Card.Body>Card Body</Card.Body>
        <Card.Footer>Card Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByText('Card Header')).toBeInTheDocument();
    expect(screen.getByText('Card Body')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  test('renders card with only header and body', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body</Card.Body>
      </Card>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
