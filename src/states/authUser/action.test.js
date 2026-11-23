/**
 * skenario pengujian
 *
 * - asyncSetAuthUser thunk
 *   - should store the token, fetch the profile and dispatch the user when the login succeeded
 *   - should show an alert, store no token and dispatch no user when the login failed
 *   - should show an alert and dispatch no user when the profile cannot be fetched
 * - asyncUnsetAuthUser thunk
 *   - should dispatch the unset action and clear the stored token
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import {
  asyncSetAuthUser,
  asyncUnsetAuthUser,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
} from './action';

const fakeCredentials = { email: 'tester@example.test', password: 'rahasia' };
const fakeToken = 'token-1';
const fakeAuthUser = {
  id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
};

describe('asyncSetAuthUser thunk', () => {
  beforeEach(() => {
    api._login = api.login;
    api._putAccessToken = api.putAccessToken;
    api._getOwnProfile = api.getOwnProfile;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.login = api._login;
    api.putAccessToken = api._putAccessToken;
    api.getOwnProfile = api._getOwnProfile;
    window.alert = window._alert;

    delete api._login;
    delete api._putAccessToken;
    delete api._getOwnProfile;
    delete window._alert;
  });

  it('should store the token, fetch the profile and dispatch the user when the login succeeded', async () => {
    // arrange
    api.login = vi.fn(() => Promise.resolve(fakeToken));
    api.putAccessToken = vi.fn();
    api.getOwnProfile = vi.fn(() => Promise.resolve(fakeAuthUser));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncSetAuthUser(fakeCredentials)(dispatch);

    // assert
    expect(window.alert).not.toHaveBeenCalled();
    expect(api.login).toHaveBeenCalledTimes(1);
    expect(api.login).toHaveBeenCalledWith(fakeCredentials);
    expect(api.putAccessToken).toHaveBeenCalledTimes(1);
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(fakeAuthUser));
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should show an alert, store no token and dispatch no user when the login failed', async () => {
    // arrange
    const fakeError = new Error('Email atau password salah');
    api.login = vi.fn(() => Promise.reject(fakeError));
    api.putAccessToken = vi.fn();
    api.getOwnProfile = vi.fn();
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncSetAuthUser(fakeCredentials)(dispatch);

    // assert
    expect(api.login).toHaveBeenCalledWith(fakeCredentials);
    expect(api.putAccessToken).not.toHaveBeenCalled();
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });

  it('should show an alert and dispatch no user when the profile cannot be fetched', async () => {
    // arrange
    const fakeError = new Error('Token tidak valid');
    api.login = vi.fn(() => Promise.resolve(fakeToken));
    api.putAccessToken = vi.fn();
    api.getOwnProfile = vi.fn(() => Promise.reject(fakeError));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncSetAuthUser(fakeCredentials)(dispatch);

    // assert
    expect(api.login).toHaveBeenCalledWith(fakeCredentials);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});

describe('asyncUnsetAuthUser thunk', () => {
  beforeEach(() => {
    api._putAccessToken = api.putAccessToken;
  });

  afterEach(() => {
    api.putAccessToken = api._putAccessToken;

    delete api._putAccessToken;
  });

  it('should dispatch the unset action and clear the stored token', () => {
    // arrange
    api.putAccessToken = vi.fn();
    const dispatch = vi.fn();

    // action
    asyncUnsetAuthUser()(dispatch);

    // assert
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(unsetAuthUserActionCreator());
    expect(api.putAccessToken).toHaveBeenCalledTimes(1);
    expect(api.putAccessToken).toHaveBeenCalledWith('');
  });
});
