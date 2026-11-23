/**
 * skenario pengujian
 *
 * - asyncReceiveLeaderboards thunk
 *   - should dispatch the leaderboards and return true when the data is fetched successfully
 *   - should show an alert and return false when the data fetching failed
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { asyncReceiveLeaderboards, receiveLeaderboardsActionCreator } from './action';

const fakeLeaderboards = [
  {
    user: {
      id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
    },
    score: 20,
  },
];

describe('asyncReceiveLeaderboards thunk', () => {
  beforeEach(() => {
    api._getLeaderboards = api.getLeaderboards;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.getLeaderboards = api._getLeaderboards;
    window.alert = window._alert;

    delete api._getLeaderboards;
    delete window._alert;
  });

  it('should dispatch the leaderboards and return true when the data is fetched successfully', async () => {
    // arrange
    api.getLeaderboards = vi.fn(() => Promise.resolve(fakeLeaderboards));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncReceiveLeaderboards()(dispatch);

    // assert
    expect(window.alert).not.toHaveBeenCalled();
    expect(api.getLeaderboards).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveLeaderboardsActionCreator(fakeLeaderboards));
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should show an alert and return false when the data fetching failed', async () => {
    // arrange
    const fakeError = new Error('Gagal mengambil papan peringkat');
    api.getLeaderboards = vi.fn(() => Promise.reject(fakeError));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncReceiveLeaderboards()(dispatch);

    // assert
    expect(api.getLeaderboards).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});
