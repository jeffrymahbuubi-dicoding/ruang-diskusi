/**
 * skenario pengujian
 *
 * - leaderboardsReducer
 *   - should start from empty list when the action type is not known
 *   - should return the leaderboards when given the RECEIVE_LEADERBOARDS action
 */
import { describe, it, expect } from 'vitest';
import leaderboardsReducer from './reducer';
import { ActionType } from './action';

const fakeLeaderboards = [
  {
    user: {
      id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
    },
    score: 20,
  },
  {
    user: {
      id: 'user-2', name: 'Penguji Dua', email: 'dua@example.test', avatar: '',
    },
    score: 10,
  },
];

describe('leaderboardsReducer', () => {
  it('should start from empty list when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = leaderboardsReducer(initialState, action);

    // assert
    expect(nextState).toEqual([]);
  });

  it('should return the leaderboards when given the RECEIVE_LEADERBOARDS action', () => {
    // arrange
    const initialState = [];
    const action = {
      type: ActionType.RECEIVE_LEADERBOARDS,
      payload: { leaderboards: fakeLeaderboards },
    };

    // action
    const nextState = leaderboardsReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeLeaderboards);
  });
});
