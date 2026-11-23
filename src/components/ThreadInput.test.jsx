/**
 * skenario pengujian
 *
 * - ThreadInput component
 *   - should show the title, category and body fields and the submit button
 *   - should handle title, category and body typing correctly
 *   - should call onAddThread once with the trimmed values when the form is submitted
 *   - should not call onAddThread when the body contains only spaces
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import ThreadInput from './ThreadInput';

expect.extend(matchers);

describe('ThreadInput component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the title, category and body fields and the submit button', () => {
    // arrange
    render(<ThreadInput onAddThread={() => {}} />);

    // assert
    expect(screen.getByLabelText('Judul')).toBeVisible();
    expect(screen.getByLabelText('Kategori (opsional)')).toBeVisible();
    expect(screen.getByLabelText('Isi diskusi')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Kirim diskusi' })).toBeVisible();
  });

  it('should handle title, category and body typing correctly', async () => {
    // arrange
    render(<ThreadInput onAddThread={() => {}} />);
    const titleInput = screen.getByLabelText('Judul');
    const categoryInput = screen.getByLabelText('Kategori (opsional)');
    const bodyInput = screen.getByLabelText('Isi diskusi');

    // action
    await userEvent.type(titleInput, 'Judul uji');
    await userEvent.type(categoryInput, 'react');
    await userEvent.type(bodyInput, 'Isi uji');

    // assert
    expect(titleInput).toHaveValue('Judul uji');
    expect(categoryInput).toHaveValue('react');
    expect(bodyInput).toHaveValue('Isi uji');
  });

  it('should call onAddThread once with the trimmed values when the form is submitted', async () => {
    // arrange
    const mockAddThread = vi.fn();
    render(<ThreadInput onAddThread={mockAddThread} />);
    await userEvent.type(screen.getByLabelText('Judul'), '  Judul uji  ');
    await userEvent.type(screen.getByLabelText('Kategori (opsional)'), ' react ');
    await userEvent.type(screen.getByLabelText('Isi diskusi'), '  Isi uji ');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim diskusi' }));

    // assert
    expect(mockAddThread).toHaveBeenCalledTimes(1);
    expect(mockAddThread).toHaveBeenCalledWith({
      title: 'Judul uji',
      body: 'Isi uji',
      category: 'react',
    });
  });

  it('should not call onAddThread when the body contains only spaces', async () => {
    // arrange
    const mockAddThread = vi.fn();
    render(<ThreadInput onAddThread={mockAddThread} />);
    await userEvent.type(screen.getByLabelText('Judul'), 'Judul uji');
    await userEvent.type(screen.getByLabelText('Isi diskusi'), '   ');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim diskusi' }));

    // assert
    expect(mockAddThread).not.toHaveBeenCalled();
  });
});
