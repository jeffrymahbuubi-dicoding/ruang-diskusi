/**
 * skenario pengujian
 *
 * - CategoryFilter component
 *   - should show one button per category with a hash prefix
 *   - should mark only the active category as pressed
 *   - should mark no button as pressed when no category is active
 *   - should call onSelect once with the category when a button is clicked
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import CategoryFilter from './CategoryFilter';

expect.extend(matchers);

const categories = ['react', 'redux', 'testing'];

describe('CategoryFilter component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show one button per category with a hash prefix', () => {
    // arrange
    render(<CategoryFilter categories={categories} onSelect={() => {}} />);

    // assert
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: '#react' })).toBeVisible();
    expect(screen.getByRole('button', { name: '#redux' })).toBeVisible();
    expect(screen.getByRole('button', { name: '#testing' })).toBeVisible();
  });

  it('should mark only the active category as pressed', () => {
    // arrange
    render(<CategoryFilter categories={categories} activeCategory="redux" onSelect={() => {}} />);

    // assert
    expect(screen.getByRole('button', { name: '#redux' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '#react' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '#testing' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should mark no button as pressed when no category is active', () => {
    // arrange
    render(<CategoryFilter categories={categories} onSelect={() => {}} />);

    // assert
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('should call onSelect once with the category when a button is clicked', async () => {
    // arrange
    const mockOnSelect = vi.fn();
    render(<CategoryFilter categories={categories} onSelect={mockOnSelect} />);

    // action
    await userEvent.click(screen.getByRole('button', { name: '#testing' }));

    // assert
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('testing');
  });
});
