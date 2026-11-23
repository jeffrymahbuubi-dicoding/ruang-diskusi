/**
 * skenario pengujian
 *
 * - asyncPopulateUsersAndThreads thunk
 *   - should dispatch the loading bar and both receive actions when the data is fetched successfully
 *   - should show an alert and still hide the loading bar when the data fetching failed
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { asyncPopulateUsersAndThreads } from './action';
import { receiveUsersActionCreator } from '../users/action';
import { receiveThreadsActionCreator } from '../threads/action';

const fakeUsers = [
  {
    id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
  },
];
const fakeThreads = [
  {
    id: 'thread-1',
    title: 'Judul diskusi',
    body: 'Isi diskusi',
    category: 'redux',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0,
  },
];
const fakeErrorResponse = new Error('Gagal mengambil data');

describe('asyncPopulateUsersAndThreads thunk', () => {
  beforeEach(() => {
    api._getAllUsers = api.getAllUsers;
    api._getAllThreads = api.getAllThreads;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.getAllUsers = api._getAllUsers;
    api.getAllThreads = api._getAllThreads;
    window.alert = window._alert;

    delete api._getAllUsers;
    delete api._getAllThreads;
    delete window._alert;
  });

  it('should dispatch the loading bar and both receive actions when the data is fetched successfully', async () => {
    // arrange
    api.getAllUsers = vi.fn(() => Promise.resolve(fakeUsers));
    api.getAllThreads = vi.fn(() => Promise.resolve(fakeThreads));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    await asyncPopulateUsersAndThreads()(dispatch);

    // assert
    expect(window.alert).not.toHaveBeenCalled();
    expect(api.getAllUsers).toHaveBeenCalledTimes(1);
    expect(api.getAllThreads).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, receiveUsersActionCreator(fakeUsers));
    expect(dispatch).toHaveBeenNthCalledWith(3, receiveThreadsActionCreator(fakeThreads));
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
  });

  it('should show an alert and still hide the loading bar when the data fetching failed', async () => {
    // arrange
    api.getAllUsers = vi.fn(() => Promise.reject(fakeErrorResponse));
    api.getAllThreads = vi.fn(() => Promise.resolve(fakeThreads));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    await asyncPopulateUsersAndThreads()(dispatch);

    // assert
    expect(api.getAllUsers).toHaveBeenCalledTimes(1);
    expect(api.getAllThreads).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeErrorResponse.message);
  });
});
