/**
 * skenario pengujian
 *
 * - CommentInput component
 *   - should show the comment form when the user is logged in
 *   - should show a link to the login page and no form when the user is logged out
 *   - should call addComment once with the trimmed text when the form is submitted
 *   - should clear the field when addComment resolves with true
 *   - should keep the text when addComment resolves with false
 *   - should not call addComment when the text contains only spaces
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import CommentInput from './CommentInput';

expect.extend(matchers);

function renderCommentInput({ isLoggedIn = true, addComment = () => Promise.resolve(true) } = {}) {
  return render(
    <MemoryRouter>
      <CommentInput isLoggedIn={isLoggedIn} addComment={addComment} />
    </MemoryRouter>,
  );
}

describe('CommentInput component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the comment form when the user is logged in', () => {
    // arrange
    renderCommentInput();

    // assert
    expect(screen.getByLabelText('Tulis komentar')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Kirim komentar' })).toBeVisible();
  });

  it('should show a link to the login page and no form when the user is logged out', () => {
    // arrange
    renderCommentInput({ isLoggedIn: false });

    // assert
    expect(screen.getByRole('link', { name: 'Masuk' })).toHaveAttribute('href', '/login');
    expect(screen.queryByLabelText('Tulis komentar')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Kirim komentar' })).not.toBeInTheDocument();
  });

  it('should call addComment once with the trimmed text when the form is submitted', async () => {
    // arrange
    const mockAddComment = vi.fn(() => Promise.resolve(true));
    renderCommentInput({ addComment: mockAddComment });
    await userEvent.type(screen.getByLabelText('Tulis komentar'), '  Komentar uji ');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    // assert
    expect(mockAddComment).toHaveBeenCalledTimes(1);
    expect(mockAddComment).toHaveBeenCalledWith('Komentar uji');
  });

  it('should clear the field when addComment resolves with true', async () => {
    // arrange
    const mockAddComment = vi.fn(() => Promise.resolve(true));
    renderCommentInput({ addComment: mockAddComment });
    const field = screen.getByLabelText('Tulis komentar');
    await userEvent.type(field, 'Komentar uji');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    // assert
    expect(mockAddComment).toHaveBeenCalledWith('Komentar uji');
    expect(field).toHaveValue('');
  });

  it('should keep the text when addComment resolves with false', async () => {
    // arrange
    const mockAddComment = vi.fn(() => Promise.resolve(false));
    renderCommentInput({ addComment: mockAddComment });
    const field = screen.getByLabelText('Tulis komentar');
    await userEvent.type(field, 'Komentar uji');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    // assert
    expect(mockAddComment).toHaveBeenCalledTimes(1);
    expect(field).toHaveValue('Komentar uji');
  });

  it('should not call addComment when the text contains only spaces', async () => {
    // arrange
    const mockAddComment = vi.fn(() => Promise.resolve(true));
    renderCommentInput({ addComment: mockAddComment });
    await userEvent.type(screen.getByLabelText('Tulis komentar'), '   ');

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));

    // assert
    expect(mockAddComment).not.toHaveBeenCalled();
  });
});
