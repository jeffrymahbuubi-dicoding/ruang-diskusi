/**
 * skenario pengujian
 *
 * - asyncAddThread thunk
 *   - should call the create API and dispatch the new thread when the request succeeded
 *   - should show an alert and return false when the request failed
 * - asyncVoteThread thunk
 *   - should show an alert and call nothing when the user is not logged in
 *   - should call nothing when the thread is not in the list
 *   - should dispatch the vote first and then call the vote API when the request succeeded
 *   - should dispatch a second action with the previous vote type and show an alert when the request failed
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { asyncAddThread, asyncVoteThread, addThreadActionCreator, voteThreadActionCreator } from './action';

const fakeThread = {
  id: 'thread-1',
  title: 'Judul diskusi',
  body: 'Isi diskusi',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};
const fakeAuthUser = {
  id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
};

describe('asyncAddThread thunk', () => {
  beforeEach(() => {
    api._createThread = api.createThread;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.createThread = api._createThread;
    window.alert = window._alert;

    delete api._createThread;
    delete window._alert;
  });

  it('should call the create API and dispatch the new thread when the request succeeded', async () => {
    // arrange
    const form = { title: fakeThread.title, body: fakeThread.body, category: fakeThread.category };
    api.createThread = vi.fn(() => Promise.resolve(fakeThread));
    const dispatch = vi.fn();

    // action
    const done = await asyncAddThread(form)(dispatch);

    // assert
    expect(api.createThread).toHaveBeenCalledTimes(1);
    expect(api.createThread).toHaveBeenCalledWith(form);
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, addThreadActionCreator(fakeThread));
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should show an alert and return false when the request failed', async () => {
    // arrange
    const fakeError = new Error('Judul tidak boleh kosong');
    api.createThread = vi.fn(() => Promise.reject(fakeError));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncAddThread({ title: '', body: 'Isi', category: '' })(dispatch);

    // assert
    expect(api.createThread).toHaveBeenCalledWith({ title: '', body: 'Isi', category: '' });
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});

describe('asyncVoteThread thunk', () => {
  beforeEach(() => {
    api._voteThread = api.voteThread;
    window._alert = window.alert;
  });

  afterEach(() => {
    api.voteThread = api._voteThread;
    window.alert = window._alert;

    delete api._voteThread;
    delete window._alert;
  });

  it('should show an alert and call nothing when the user is not logged in', async () => {
    // arrange
    api.voteThread = vi.fn();
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threads: [fakeThread] });

    // action
    const done = await asyncVoteThread({ threadId: 'thread-1', voteType: 1 })(dispatch, getState);

    // assert
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Masuk untuk memberi suara');
    expect(api.voteThread).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(done).toBe(false);
  });

  it('should call nothing when the thread is not in the list', async () => {
    // arrange
    api.voteThread = vi.fn();
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threads: [fakeThread] });

    // action
    const done = await asyncVoteThread({ threadId: 'thread-404', voteType: 1 })(dispatch, getState);

    // assert
    expect(api.voteThread).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(done).toBe(false);
  });

  it('should dispatch the vote first and then call the vote API when the request succeeded', async () => {
    // arrange
    api.voteThread = vi.fn(() => Promise.resolve({ id: 'vote-1' }));
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threads: [fakeThread] });

    // action
    const done = await asyncVoteThread({ threadId: 'thread-1', voteType: 1 })(dispatch, getState);

    // assert
    expect(api.voteThread).toHaveBeenCalledTimes(1);
    expect(api.voteThread).toHaveBeenCalledWith({ threadId: 'thread-1', voteType: 1 });
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      voteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should dispatch a second action with the previous vote type and show an alert when the request failed', async () => {
    // arrange
    const fakeError = new Error('Gagal memberi suara');
    const votedThread = { ...fakeThread, upVotesBy: ['user-1'] };
    api.voteThread = vi.fn(() => Promise.reject(fakeError));
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threads: [votedThread] });

    // action
    const done = await asyncVoteThread({ threadId: 'thread-1', voteType: -1 })(dispatch, getState);

    // assert
    expect(api.voteThread).toHaveBeenCalledWith({ threadId: 'thread-1', voteType: -1 });
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      voteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1', voteType: -1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      voteThreadActionCreator({ threadId: 'thread-1', userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});
