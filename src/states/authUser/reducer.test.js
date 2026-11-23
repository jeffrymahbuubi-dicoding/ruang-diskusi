/**
 * skenario pengujian
 *
 * - authUserReducer
 *   - should start from null when the action type is not known
 *   - should return the user when given the SET_AUTH_USER action
 *   - should return null when given the UNSET_AUTH_USER action
 */
import { describe, it, expect } from 'vitest';
import authUserReducer from './reducer';
import { ActionType } from './action';

const fakeUser = {
  id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
};

describe('authUserReducer', () => {
  it('should start from null when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('should return the user when given the SET_AUTH_USER action', () => {
    // arrange
    const initialState = null;
    const action = { type: ActionType.SET_AUTH_USER, payload: { authUser: fakeUser } };

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toEqual(fakeUser);
  });

  it('should return null when given the UNSET_AUTH_USER action', () => {
    // arrange
    const initialState = fakeUser;
    const action = { type: ActionType.UNSET_AUTH_USER };

    // action
    const nextState = authUserReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });
});
