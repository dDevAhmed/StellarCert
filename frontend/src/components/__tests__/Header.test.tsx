import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../NotificationDropdown', () => ({
  default: () => <div data-testid="notification-dropdown" />,
}));

vi.mock('../ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}));

import Header from '../Header';

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders the logo and site name', () => {
    renderHeader();
    expect(screen.getAllByText('StellarCert').length).toBeGreaterThan(0);
  });

  it('shows hamburger button on mobile (aria-label present)', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('drawer is not visible initially', () => {
    renderHeader();
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('opens the drawer when hamburger button is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-0');
  });

  it('closes the drawer when close button is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('closes the drawer when overlay is clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const overlay = screen.getByTestId('drawer-overlay');
    fireEvent.click(overlay);
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('closes the drawer on Escape key press', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.keyDown(document, { key: 'Escape' });
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('drawer nav links close the drawer when clicked', () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    // Click the Home nav link in the drawer
    const homeLinks = screen.getAllByRole('link', { name: /home/i });
    fireEvent.click(homeLinks[homeLinks.length - 1]);
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('drawer has correct ARIA attributes', () => {
    renderHeader();
    const drawer = document.getElementById('mobile-nav-drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
  });

  it('hamburger button reflects aria-expanded state', () => {
    renderHeader();
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });
});
