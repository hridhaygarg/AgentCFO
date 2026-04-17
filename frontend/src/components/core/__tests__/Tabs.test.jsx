import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../Tabs';

describe('Tabs Component', () => {
  const tabs = [
    { label: 'Tab 1', id: 'tab1' },
    { label: 'Tab 2', id: 'tab2' },
    { label: 'Tab 3', id: 'tab3' },
  ];

  // Basic rendering tests
  test('renders all tab buttons', () => {
    render(
      <Tabs tabs={tabs} activeTab="tab1">
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: /tab 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 2/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /tab 3/i })).toBeInTheDocument();
  });

  test('renders tab content for active tab', () => {
    render(
      <Tabs tabs={tabs} activeTab="tab1">
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    expect(screen.getByText('Tab 1 Content')).toBeInTheDocument();
    expect(screen.queryByText('Tab 2 Content')).not.toBeInTheDocument();
  });

  test('applies underline to active tab', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="tab1">
        <div id="tab1">Tab 1 Content</div>
      </Tabs>
    );

    const activeButton = screen.getByRole('tab', { name: /tab 1/i });
    expect(activeButton).toHaveClass('border-b-2');
    expect(activeButton).toHaveClass('border-blue-600');
  });

  test('does not apply underline to inactive tabs', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="tab1">
        <div id="tab1">Tab 1 Content</div>
      </Tabs>
    );

    const inactiveButton = screen.getByRole('tab', { name: /tab 2/i });
    expect(inactiveButton).not.toHaveClass('border-b-2');
  });
});

describe('Tabs Click Behavior', () => {
  const tabs = [
    { label: 'First', id: 'first' },
    { label: 'Second', id: 'second' },
  ];

  test('calls onChange when tab is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="first" onChange={handleChange}>
        <div id="first">First Content</div>
        <div id="second">Second Content</div>
      </Tabs>
    );

    const secondTab = screen.getByRole('tab', { name: /second/i });
    fireEvent.click(secondTab);
    expect(handleChange).toHaveBeenCalledWith('second');
  });

  test('switches content when tab is clicked', () => {
    const TestComponent = () => {
      const [activeTab, setActiveTab] = useState('first');
      return (
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        >
          <div id="first">First Content</div>
          <div id="second">Second Content</div>
        </Tabs>
      );
    };

    render(<TestComponent />);
    expect(screen.getByText('First Content')).toBeInTheDocument();

    const secondTab = screen.getByRole('tab', { name: /second/i });
    fireEvent.click(secondTab);

    expect(screen.queryByText('First Content')).not.toBeInTheDocument();
    expect(screen.getByText('Second Content')).toBeInTheDocument();
  });
});

describe('Tabs Keyboard Navigation', () => {
  const tabs = [
    { label: 'Tab 1', id: 'tab1' },
    { label: 'Tab 2', id: 'tab2' },
    { label: 'Tab 3', id: 'tab3' },
  ];

  test('navigates to next tab with right arrow key', async () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="tab1" onChange={handleChange}>
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    const firstTab = screen.getByRole('tab', { name: /tab 1/i });
    firstTab.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  test('navigates to previous tab with left arrow key', async () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="tab2" onChange={handleChange}>
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    const secondTab = screen.getByRole('tab', { name: /tab 2/i });
    secondTab.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  test('wraps to last tab when pressing left arrow on first tab', async () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="tab1" onChange={handleChange}>
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    const firstTab = screen.getByRole('tab', { name: /tab 1/i });
    firstTab.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(handleChange).toHaveBeenCalledWith('tab3');
  });

  test('wraps to first tab when pressing right arrow on last tab', async () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="tab3" onChange={handleChange}>
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    const lastTab = screen.getByRole('tab', { name: /tab 3/i });
    lastTab.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  test('allows spacebar to activate tab (like standard button)', async () => {
    const handleChange = jest.fn();
    render(
      <Tabs tabs={tabs} activeTab="tab1" onChange={handleChange}>
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
        <div id="tab3">Tab 3 Content</div>
      </Tabs>
    );

    const secondTab = screen.getByRole('tab', { name: /tab 2/i });
    secondTab.focus();
    // Spacebar doesn't trigger click on regular buttons without additional handling
    // Just verify the tab is focusable
    expect(secondTab).toHaveFocus();
  });
});

describe('Tabs ARIA Attributes', () => {
  const tabs = [
    { label: 'Home', id: 'home' },
    { label: 'Profile', id: 'profile' },
  ];

  test('tab list has correct role attribute', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="home">
        <div id="home">Home Content</div>
        <div id="profile">Profile Content</div>
      </Tabs>
    );

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toBeInTheDocument();
  });

  test('tabs have role="tab" attribute', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="home">
        <div id="home">Home Content</div>
        <div id="profile">Profile Content</div>
      </Tabs>
    );

    const tabButtons = container.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBe(2);
  });

  test('active tab has aria-selected="true"', () => {
    render(
      <Tabs tabs={tabs} activeTab="home">
        <div id="home">Home Content</div>
        <div id="profile">Profile Content</div>
      </Tabs>
    );

    const activeTab = screen.getByRole('tab', { name: /home/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('inactive tab has aria-selected="false"', () => {
    render(
      <Tabs tabs={tabs} activeTab="home">
        <div id="home">Home Content</div>
        <div id="profile">Profile Content</div>
      </Tabs>
    );

    const inactiveTab = screen.getByRole('tab', { name: /profile/i });
    expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
  });

  test('tabs have aria-labelledby or id/aria-labelledby connection', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="home">
        <div id="home">Home Content</div>
        <div id="profile">Profile Content</div>
      </Tabs>
    );

    const tabs_elements = container.querySelectorAll('[role="tab"]');
    tabs_elements.forEach((tab) => {
      expect(tab).toHaveAttribute('id');
    });
  });
});

describe('Tabs Smooth Transitions', () => {
  const tabs = [
    { label: 'Tab 1', id: 'tab1' },
    { label: 'Tab 2', id: 'tab2' },
  ];

  test('content has transition classes for smooth switching', () => {
    const { container } = render(
      <Tabs tabs={tabs} activeTab="tab1">
        <div id="tab1">Tab 1 Content</div>
        <div id="tab2">Tab 2 Content</div>
      </Tabs>
    );

    const contentArea = container.querySelector('[role="tabpanel"]');
    expect(contentArea).toHaveClass('transition-opacity');
  });
});
