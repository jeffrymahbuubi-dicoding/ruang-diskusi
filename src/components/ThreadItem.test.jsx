/**
 * skenario pengujian
 *
 * - ThreadItem component
 *   - should link the title to the thread detail page
 *   - should show the category, the owner name and the comment count
 *   - should show the whole body when it is short
 *   - should cut a long body to an excerpt ending with three dots
 *   - should strip HTML tags from the body
 *   - should call onVote with the thread id and the vote type when a vote button is clicked
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import ThreadItem from './ThreadItem';

expect.extend(matchers);

const baseThread = {
  id: 'thread-1',
  title: 'Judul diskusi uji',
  body: 'Isi singkat',
  category: 'react',
  createdAt: '2026-01-05T08:30:00.000Z',
  upVotesBy: ['user-a'],
  downVotesBy: [],
  totalComments: 3,
  owner: { id: 'user-o', name: 'Pemilik Uji', avatar: '' },
};

function renderThreadItem({ thread = baseThread, onVote = () => {}, authUserId = 'user-z' } = {}) {
  return render(
    <MemoryRouter>
      <ThreadItem thread={thread} authUserId={authUserId} onVote={onVote} />
    </MemoryRouter>,
  );
}

describe('ThreadItem component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should link the title to the thread detail page', () => {
    // arrange
    renderThreadItem();

    // assert
    expect(screen.getByRole('link', { name: 'Judul diskusi uji' })).toHaveAttribute('href', '/threads/thread-1');
  });

  it('should show the category, the owner name and the comment count', () => {
    // arrange
    renderThreadItem();

    // assert
    expect(screen.getByText('#react')).toBeVisible();
    expect(screen.getByText('Pemilik Uji', { selector: '.thread-item__owner' })).toBeVisible();
    expect(screen.getByText('3 komentar')).toBeVisible();
  });

  it('should show the whole body when it is short', () => {
    // arrange
    renderThreadItem();

    // assert
    expect(screen.getByText('Isi singkat')).toBeVisible();
  });

  it('should cut a long body to an excerpt ending with three dots', () => {
    // arrange
    const longBody = 'a'.repeat(200);
    renderThreadItem({ thread: { ...baseThread, body: longBody } });

    // assert
    expect(screen.getByText(`${'a'.repeat(160)}...`)).toBeVisible();
    expect(screen.queryByText(longBody)).not.toBeInTheDocument();
  });

  it('should strip HTML tags from the body', () => {
    // arrange
    renderThreadItem({ thread: { ...baseThread, body: '<p>Halo <strong>dunia</strong></p>' } });

    // assert
    expect(screen.getByText('Halo dunia')).toBeVisible();
  });

  it('should call onVote with the thread id and the vote type when a vote button is clicked', async () => {
    // arrange
    const mockOnVote = vi.fn();
    renderThreadItem({ onVote: mockOnVote });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(mockOnVote).toHaveBeenCalledTimes(1);
    expect(mockOnVote).toHaveBeenCalledWith('thread-1', 1);
  });
});
