/**
 * skenario pengujian
 *
 * - categoryFilterReducer
 *   - should start from empty string when the action type is not known
 *   - should return the category when given the SET_CATEGORY_FILTER action
 *   - should return an empty string when the SET_CATEGORY_FILTER action clears the category
 */
import { describe, it, expect } from 'vitest';
import categoryFilterReducer from './reducer';
import { ActionType } from './action';

describe('categoryFilterReducer', () => {
  it('should start from empty string when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = categoryFilterReducer(initialState, action);

    // assert
    expect(nextState).toBe('');
  });

  it('should return the category when given the SET_CATEGORY_FILTER action', () => {
    // arrange
    const initialState = '';
    const action = { type: ActionType.SET_CATEGORY_FILTER, payload: { category: 'redux' } };

    // action
    const nextState = categoryFilterReducer(initialState, action);

    // assert
    expect(nextState).toBe('redux');
  });

  it('should return an empty string when the SET_CATEGORY_FILTER action clears the category', () => {
    // arrange
    const initialState = 'redux';
    const action = { type: ActionType.SET_CATEGORY_FILTER, payload: { category: '' } };

    // action
    const nextState = categoryFilterReducer(initialState, action);

    // assert
    expect(nextState).toBe('');
  });
});
