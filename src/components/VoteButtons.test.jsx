/**
 * skenario pengujian
 *
 * - VoteButtons component
 *   - should show the up and down counts
 *   - should mark only the up button as pressed when the user up-voted
 *   - should mark only the down button as pressed when the user down-voted
 *   - should mark no button as pressed when the user did not vote or is a guest
 *   - should call onVote with 1 when the up button is clicked and the user has not up-voted
 *   - should call onVote with 0 when the active up button is clicked
 *   - should call onVote with -1 when the down button is clicked and the user has not down-voted
 *   - should call onVote with 0 when the active down button is clicked
 */
import React from 'react';
import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import VoteButtons from './VoteButtons';

expect.extend(matchers);

function renderVoteButtons(props = {}) {
  return render(
    <VoteButtons
      upVotesBy={['user-a', 'user-b']}
      downVotesBy={['user-c']}
      authUserId="user-z"
      onVote={() => {}}
      {...props}
    />,
  );
}

describe('VoteButtons component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show the up and down counts', () => {
    // arrange
    const { container } = renderVoteButtons();

    // assert
    expect(container.querySelector('[data-count="up"]')).toHaveTextContent('2');
    expect(container.querySelector('[data-count="down"]')).toHaveTextContent('1');
  });

  it('should mark only the up button as pressed when the user up-voted', () => {
    // arrange
    renderVoteButtons({ authUserId: 'user-a' });

    // assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should mark only the down button as pressed when the user down-voted', () => {
    // arrange
    renderVoteButtons({ authUserId: 'user-c' });

    // assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('should mark no button as pressed when the user did not vote or is a guest', () => {
    // arrange
    const { rerender } = renderVoteButtons({ authUserId: 'user-z' });

    // assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Tidak suka' })).toHaveAttribute('aria-pressed', 'false');

    // action
    rerender(
      <VoteButtons upVotesBy={['user-a']} downVotesBy={[]} authUserId={null} onVote={() => {}} />,
    );

    // assert
    expect(screen.getByRole('button', { name: 'Suka' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onVote with 1 when the up button is clicked and the user has not up-voted', async () => {
    // arrange
    const mockOnVote = vi.fn();
    renderVoteButtons({ onVote: mockOnVote });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(mockOnVote).toHaveBeenCalledTimes(1);
    expect(mockOnVote).toHaveBeenCalledWith(1);
  });

  it('should call onVote with 0 when the active up button is clicked', async () => {
    // arrange
    const mockOnVote = vi.fn();
    renderVoteButtons({ authUserId: 'user-a', onVote: mockOnVote });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Suka' }));

    // assert
    expect(mockOnVote).toHaveBeenCalledTimes(1);
    expect(mockOnVote).toHaveBeenCalledWith(0);
  });

  it('should call onVote with -1 when the down button is clicked and the user has not down-voted', async () => {
    // arrange
    const mockOnVote = vi.fn();
    renderVoteButtons({ onVote: mockOnVote });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Tidak suka' }));

    // assert
    expect(mockOnVote).toHaveBeenCalledTimes(1);
    expect(mockOnVote).toHaveBeenCalledWith(-1);
  });

  it('should call onVote with 0 when the active down button is clicked', async () => {
    // arrange
    const mockOnVote = vi.fn();
    renderVoteButtons({ authUserId: 'user-c', onVote: mockOnVote });

    // action
    await userEvent.click(screen.getByRole('button', { name: 'Tidak suka' }));

    // assert
    expect(mockOnVote).toHaveBeenCalledTimes(1);
    expect(mockOnVote).toHaveBeenCalledWith(0);
  });
});
