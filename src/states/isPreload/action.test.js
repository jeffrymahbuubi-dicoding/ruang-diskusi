/**
 * skenario pengujian
 *
 * - asyncPreloadProcess thunk
 *   - should fetch the profile, dispatch the user and end the preload when a token is stored
 *   - should dispatch no profile request, a null user and end the preload when no token is stored
 *   - should dispatch a null user and still end the preload when the profile cannot be fetched
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { asyncPreloadProcess, setIsPreloadActionCreator } from './action';
import { setAuthUserActionCreator } from '../authUser/action';

const fakeAuthUser = {
  id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
};

describe('asyncPreloadProcess thunk', () => {
  beforeEach(() => {
    api._getAccessToken = api.getAccessToken;
    api._getOwnProfile = api.getOwnProfile;
  });

  afterEach(() => {
    api.getAccessToken = api._getAccessToken;
    api.getOwnProfile = api._getOwnProfile;

    delete api._getAccessToken;
    delete api._getOwnProfile;
  });

  it('should fetch the profile, dispatch the user and end the preload when a token is stored', async () => {
    // arrange
    api.getAccessToken = vi.fn(() => 'token-1');
    api.getOwnProfile = vi.fn(() => Promise.resolve(fakeAuthUser));
    const dispatch = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(api.getAccessToken).toHaveBeenCalledTimes(1);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(fakeAuthUser));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
  });

  it('should dispatch no profile request, a null user and end the preload when no token is stored', async () => {
    // arrange
    api.getAccessToken = vi.fn(() => null);
    api.getOwnProfile = vi.fn();
    const dispatch = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(api.getAccessToken).toHaveBeenCalledTimes(1);
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(null));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
  });

  it('should dispatch a null user and still end the preload when the profile cannot be fetched', async () => {
    // arrange
    api.getAccessToken = vi.fn(() => 'token-1');
    api.getOwnProfile = vi.fn(() => Promise.reject(new Error('Token tidak valid')));
    const dispatch = vi.fn();

    // action
    await asyncPreloadProcess()(dispatch);

    // assert
    expect(api.getAccessToken).toHaveBeenCalledTimes(1);
    expect(api.getOwnProfile).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, setAuthUserActionCreator(null));
    expect(dispatch).toHaveBeenNthCalledWith(3, setIsPreloadActionCreator(false));
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
  });
});
