/**
 * skenario pengujian
 *
 * - asyncRegisterUser thunk
 *   - should call the register API with the form values and return true when the registration succeeded
 *   - should show an alert and return false when the registration failed
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { asyncRegisterUser } from './action';

const fakeForm = { name: 'Penguji Satu', email: 'tester@example.test', password: 'rahasia' };

describe('asyncRegisterUser thunk', () => {
  beforeEach(() => {
    api._register = api.register;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.register = api._register;
    window.alert = window._alert;

    delete api._register;
    delete window._alert;
  });

  it('should call the register API with the form values and return true when the registration succeeded', async () => {
    // arrange
    api.register = vi.fn(() => Promise.resolve({ id: 'user-1', name: fakeForm.name, email: fakeForm.email }));
    const dispatch = vi.fn();

    // action
    const done = await asyncRegisterUser(fakeForm)(dispatch);

    // assert
    expect(api.register).toHaveBeenCalledTimes(1);
    expect(api.register).toHaveBeenCalledWith(fakeForm);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(done).toBe(true);
  });

  it('should show an alert and return false when the registration failed', async () => {
    // arrange
    const fakeError = new Error('Email sudah digunakan');
    api.register = vi.fn(() => Promise.reject(fakeError));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncRegisterUser(fakeForm)(dispatch);

    // assert
    expect(api.register).toHaveBeenCalledWith(fakeForm);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});
