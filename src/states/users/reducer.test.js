/**
 * skenario pengujian
 *
 * - usersReducer
 *   - should start from empty list when the action type is not known
 *   - should return the users when given the RECEIVE_USERS action
 */
import { describe, it, expect } from 'vitest';
import usersReducer from './reducer';
import { ActionType } from './action';

const fakeUsers = [
  {
    id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
  },
  {
    id: 'user-2', name: 'Penguji Dua', email: 'dua@example.test', avatar: '',
  },
];

describe('usersReducer', () => {
  it('should start from empty list when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = usersReducer(initialState, action);

    // assert
    expect(nextState).toEqual([]);
  });

  it('should return the users when given the RECEIVE_USERS action', () => {
    // arrange
    const initialState = [];
    const action = { type: ActionType.RECEIVE_USERS, payload: { users: fakeUsers } };

    // action
    const nextState = usersReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeUsers);
  });
});
