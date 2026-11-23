/**
 * skenario pengujian
 *
 * - threadsReducer
 *   - should start from empty list when the action type is not known
 *   - should return the threads when given the RECEIVE_THREADS action
 *   - should put the new thread first when given the ADD_THREAD action
 *   - should add the user to upVotesBy when given the VOTE_THREAD action with vote type 1
 *   - should move the user from upVotesBy to downVotesBy when given the VOTE_THREAD action with vote type -1
 *   - should remove the user from both lists when given the VOTE_THREAD action with vote type 0
 *   - should leave the list unchanged when the VOTE_THREAD action names an unknown thread id
 */
import { describe, it, expect } from 'vitest';
import threadsReducer from './reducer';
import { ActionType } from './action';

const threadOne = {
  id: 'thread-1',
  title: 'Judul pertama',
  body: 'Isi pertama',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};
const threadTwo = {
  id: 'thread-2',
  title: 'Judul kedua',
  body: 'Isi kedua',
  category: 'react',
  createdAt: '2024-01-02T00:00:00.000Z',
  ownerId: 'user-2',
  upVotesBy: ['user-3'],
  downVotesBy: ['user-1'],
  totalComments: 2,
};

describe('threadsReducer', () => {
  it('should start from empty list when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([]);
  });

  it('should return the threads when given the RECEIVE_THREADS action', () => {
    // arrange
    const initialState = [];
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: { threads: [threadOne, threadTwo] },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([threadOne, threadTwo]);
  });

  it('should put the new thread first when given the ADD_THREAD action', () => {
    // arrange
    const initialState = [threadOne];
    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: threadTwo },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([threadTwo, threadOne]);
  });

  it('should add the user to upVotesBy when given the VOTE_THREAD action with vote type 1', () => {
    // arrange
    const initialState = [threadOne, threadTwo];
    const action = {
      type: ActionType.VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-9', voteType: 1 },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([{ ...threadOne, upVotesBy: ['user-9'] }, threadTwo]);
  });

  it('should move the user from upVotesBy to downVotesBy when given the VOTE_THREAD action with vote type -1', () => {
    // arrange
    const initialState = [{ ...threadOne, upVotesBy: ['user-9', 'user-3'] }, threadTwo];
    const action = {
      type: ActionType.VOTE_THREAD,
      payload: { threadId: 'thread-1', userId: 'user-9', voteType: -1 },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState[0].upVotesBy).toEqual(['user-3']);
    expect(nextState[0].downVotesBy).toEqual(['user-9']);
    expect(nextState[1]).toEqual(threadTwo);
  });

  it('should remove the user from both lists when given the VOTE_THREAD action with vote type 0', () => {
    // arrange
    const initialState = [threadOne, threadTwo];
    const action = {
      type: ActionType.VOTE_THREAD,
      payload: { threadId: 'thread-2', userId: 'user-1', voteType: 0 },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState[1].upVotesBy).toEqual(['user-3']);
    expect(nextState[1].downVotesBy).toEqual([]);
    expect(nextState[0]).toEqual(threadOne);
  });

  it('should leave the list unchanged when the VOTE_THREAD action names an unknown thread id', () => {
    // arrange
    const initialState = [threadOne, threadTwo];
    const action = {
      type: ActionType.VOTE_THREAD,
      payload: { threadId: 'thread-404', userId: 'user-9', voteType: 1 },
    };

    // action
    const nextState = threadsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([threadOne, threadTwo]);
  });
});
