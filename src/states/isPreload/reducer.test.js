/**
 * skenario pengujian
 *
 * - isPreloadReducer
 *   - should start from true when the action type is not known
 *   - should return the new value when given the SET_IS_PRELOAD action
 */
import { describe, it, expect } from 'vitest';
import isPreloadReducer from './reducer';
import { ActionType } from './action';

describe('isPreloadReducer', () => {
  it('should start from true when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = isPreloadReducer(initialState, action);

    // assert
    expect(nextState).toBe(true);
  });

  it('should return the new value when given the SET_IS_PRELOAD action', () => {
    // arrange
    const initialState = true;
    const action = {
      type: ActionType.SET_IS_PRELOAD,
      payload: { isPreload: false },
    };

    // action
    const nextState = isPreloadReducer(initialState, action);

    // assert
    expect(nextState).toBe(false);
  });
});
