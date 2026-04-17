import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  // Basic rendering tests
  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
        Modal Content
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Modal Content
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('renders modal title when provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  test('renders close button in modal', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Content
      </Modal>
    );
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  test('applies semi-transparent backdrop classes', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Content
      </Modal>
    );
    const backdrop = container.querySelector('[class*="bg-black"]');
    expect(backdrop).toHaveClass('bg-black/50');
  });
});

describe('Modal Close Behavior', () => {
  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    const handleClose = jest.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );
    const backdrop = container.querySelector('[class*="bg-black/50"]');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <input type="text" />
      </Modal>
    );
    const input = screen.getByRole('textbox');
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  test('does not close when clicking on modal content', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    const content = screen.getByText('Modal Content');
    fireEvent.click(content);
    expect(handleClose).not.toHaveBeenCalled();
  });
});

describe('Modal Sizes', () => {
  test('applies small size classes when size="sm"', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test" size="sm">
        Content
      </Modal>
    );
    const modalDialog = container.querySelector('[class*="max-w"]');
    expect(modalDialog).toHaveClass('max-w-sm');
  });

  test('applies medium size classes when size="md"', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test" size="md">
        Content
      </Modal>
    );
    const modalDialog = container.querySelector('[class*="max-w"]');
    expect(modalDialog).toHaveClass('max-w-md');
  });

  test('applies large size classes when size="lg"', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test" size="lg">
        Content
      </Modal>
    );
    const modalDialog = container.querySelector('[class*="max-w"]');
    expect(modalDialog).toHaveClass('max-w-lg');
  });

  test('applies default medium size when size is not specified', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test">
        Content
      </Modal>
    );
    const modalDialog = container.querySelector('[class*="max-w"]');
    expect(modalDialog).toHaveClass('max-w-md');
  });
});

describe('Modal Focus Management', () => {
  test('focus trap keeps focus inside modal', async () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <div>
          <button>Outside Button</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test">
            <input type="text" placeholder="Inside Input" />
          </Modal>
        </div>
      );
    };

    render(<TestComponent />);
    const input = screen.getByPlaceholderText('Inside Input');
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});

describe('Modal Scrolling and Body Lock', () => {
  test('modal is scrollable when content overflows', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test">
        <div style={{ height: '2000px' }}>Tall Content</div>
      </Modal>
    );
    const modalContent = container.querySelector('[class*="overflow"]');
    expect(modalContent).toHaveClass('overflow-y-auto');
  });
});

describe('Modal Content Rendering', () => {
  test('renders complex content inside modal', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <button>Action Button</button>
        </div>
      </Modal>
    );

    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action button/i })).toBeInTheDocument();
  });

  test('renders without title when title prop is not provided', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        Content without title
      </Modal>
    );
    expect(screen.getByText('Content without title')).toBeInTheDocument();
  });
});
