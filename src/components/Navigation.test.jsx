/**
 * skenario pengujian
 *
 * - Navigation component
 *   - should show the brand and the public links for every visitor
 *   - should show the login and register links and no logout button for a guest
 *   - should show the user name, the "Buat Diskusi" link and the logout button for a logged in user
 *   - should not show the login and register links for a logged in user
 *   - should call signOut once when the logout button is clicked
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

expect.extend(matchers);

const user = { id: 'user-1', name: 'Penguji Uji', avatar: '' };

function renderNavigation({ authUser = null, signOut = () => {} } = {}) {
  return render(
    <MemoryRouter>
      <Navigation authUser={authUser} signOut={signOut} />
    </MemoryRouter>,
  );
}

describe('Navigation component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the brand and the public links for every visitor', () => {
    // arrange
    renderNavigation();

    // assert
    expect(screen.getByRole('link', { name: 'Ruang Diskusi' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Beranda' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Klasemen' })).toHaveAttribute('href', '/leaderboards');
  });

  it('should show the login and register links and no logout button for a guest', () => {
    // arrange
    renderNavigation();

    // assert
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Daftar' })).toHaveAttribute('href', '/register');
    expect(screen.queryByRole('button', { name: 'Keluar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Buat Diskusi' })).not.toBeInTheDocument();
  });

  it('should show the user name, the "Buat Diskusi" link and the logout button for a logged in user', () => {
    // arrange
    renderNavigation({ authUser: user });

    // assert
    expect(screen.getByText('Penguji Uji')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Buat Diskusi' })).toHaveAttribute('href', '/new');
    expect(screen.getByRole('button', { name: 'Keluar' })).toBeVisible();
  });

  it('should not show the login and register links for a logged in user', () => {
    // arrange
    renderNavigation({ authUser: user });

    // assert
    expect(screen.queryByRole('link', { name: 'Masuk' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Daftar' })).not.toBeInTheDocument();
  });

  it('should call signOut once when the logout button is clicked', async () => {
    // arrange
    const mockSignOut = vi.fn();
    renderNavigation({ authUser: user, signOut: mockSignOut });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Keluar' }));

    // assert
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
