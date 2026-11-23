/**
 * skenario pengujian
 *
 * - asyncReceiveThreadDetail thunk
 *   - should clear the old detail first and then dispatch the fetched detail when the request succeeded
 *   - should show an alert and return false when the request failed
 * - asyncVoteThreadDetail thunk
 *   - should show an alert and call nothing when the user is not logged in
 *   - should call nothing when no thread detail is loaded
 *   - should dispatch the vote first and then call the vote API when the request succeeded
 *   - should dispatch a second action with the previous vote type and show an alert when the request failed
 * - asyncAddComment thunk
 *   - should call nothing when the user is not logged in or no thread detail is loaded
 *   - should dispatch the comment with the owner rebuilt from the logged in user when the request succeeded
 *   - should show an alert and return false when the request failed
 * - asyncVoteComment thunk
 *   - should show an alert and call nothing when the user is not logged in
 *   - should call nothing when the comment is not in the thread detail
 *   - should dispatch the vote first and then call the vote API when the request succeeded
 *   - should dispatch a second action with the previous vote type and show an alert when the request failed
 */
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import {
  asyncReceiveThreadDetail,
  asyncVoteThreadDetail,
  asyncAddComment,
  asyncVoteComment,
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  voteThreadDetailActionCreator,
  addCommentActionCreator,
  voteCommentActionCreator,
} from './action';

const fakeAuthUser = {
  id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test', avatar: '',
};
const fakeComment = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-03T00:00:00.000Z',
  owner: { id: 'user-2', name: 'Penguji Dua', avatar: '' },
  upVotesBy: [],
  downVotesBy: [],
};
const fakeDetail = {
  id: 'thread-1',
  title: 'Judul diskusi',
  body: 'Isi diskusi',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-2', name: 'Penguji Dua', avatar: '' },
  upVotesBy: [],
  downVotesBy: [],
  comments: [fakeComment],
};

beforeEach(() => {
  api._getThreadDetail = api.getThreadDetail;
  api._voteThread = api.voteThread;
  api._createComment = api.createComment;
  api._voteComment = api.voteComment;
  window._alert = window.alert;
});

afterEach(() => {
  api.getThreadDetail = api._getThreadDetail;
  api.voteThread = api._voteThread;
  api.createComment = api._createComment;
  api.voteComment = api._voteComment;
  window.alert = window._alert;

  delete api._getThreadDetail;
  delete api._voteThread;
  delete api._createComment;
  delete api._voteComment;
  delete window._alert;
});

describe('asyncReceiveThreadDetail thunk', () => {
  it('should clear the old detail first and then dispatch the fetched detail when the request succeeded', async () => {
    // arrange
    api.getThreadDetail = vi.fn(() => Promise.resolve(fakeDetail));
    const dispatch = vi.fn();

    // action
    const done = await asyncReceiveThreadDetail('thread-1')(dispatch);

    // assert
    expect(api.getThreadDetail).toHaveBeenCalledTimes(1);
    expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');
    expect(dispatch).toHaveBeenNthCalledWith(1, clearThreadDetailActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(3, receiveThreadDetailActionCreator(fakeDetail));
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(done).toBe(true);
  });

  it('should show an alert and return false when the request failed', async () => {
    // arrange
    const fakeError = new Error('Thread tidak ditemukan');
    api.getThreadDetail = vi.fn(() => Promise.reject(fakeError));
    const dispatch = vi.fn();
    window.alert = vi.fn();

    // action
    const done = await asyncReceiveThreadDetail('thread-404')(dispatch);

    // assert
    expect(api.getThreadDetail).toHaveBeenCalledWith('thread-404');
    expect(dispatch).toHaveBeenNthCalledWith(1, clearThreadDetailActionCreator());
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});

describe('asyncVoteThreadDetail thunk', () => {
  it('should show an alert and call nothing when the user is not logged in', async () => {
    // arrange
    api.voteThread = vi.fn();
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threadDetail: fakeDetail });

    // action
    const done = await asyncVoteThreadDetail(1)(dispatch, getState);

    // assert
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Masuk untuk memberi suara');
    expect(api.voteThread).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(done).toBe(false);
  });

  it('should call nothing when no thread detail is loaded', async () => {
    // arrange
    api.voteThread = vi.fn();
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: null });

    // action
    const done = await asyncVoteThreadDetail(1)(dispatch, getState);

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
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: fakeDetail });

    // action
    const done = await asyncVoteThreadDetail(1)(dispatch, getState);

    // assert
    expect(api.voteThread).toHaveBeenCalledTimes(1);
    expect(api.voteThread).toHaveBeenCalledWith({ threadId: 'thread-1', voteType: 1 });
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      voteThreadDetailActionCreator({ userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should dispatch a second action with the previous vote type and show an alert when the request failed', async () => {
    // arrange
    const fakeError = new Error('Gagal memberi suara');
    const downVotedDetail = { ...fakeDetail, downVotesBy: ['user-1'] };
    api.voteThread = vi.fn(() => Promise.reject(fakeError));
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: downVotedDetail });

    // action
    const done = await asyncVoteThreadDetail(1)(dispatch, getState);

    // assert
    expect(api.voteThread).toHaveBeenCalledWith({ threadId: 'thread-1', voteType: 1 });
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      voteThreadDetailActionCreator({ userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      voteThreadDetailActionCreator({ userId: 'user-1', voteType: -1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});

describe('asyncAddComment thunk', () => {
  it('should call nothing when the user is not logged in or no thread detail is loaded', async () => {
    // arrange
    api.createComment = vi.fn();
    const dispatch = vi.fn();

    // action
    const loggedOut = await asyncAddComment({ content: 'Halo' })(
      dispatch,
      () => ({ authUser: null, threadDetail: fakeDetail }),
    );
    const noDetail = await asyncAddComment({ content: 'Halo' })(
      dispatch,
      () => ({ authUser: fakeAuthUser, threadDetail: null }),
    );

    // assert
    expect(api.createComment).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(loggedOut).toBe(false);
    expect(noDetail).toBe(false);
  });

  it('should dispatch the comment with the owner rebuilt from the logged in user when the request succeeded', async () => {
    // arrange
    const apiComment = {
      id: 'comment-9',
      content: 'Komentar baru',
      createdAt: '2024-01-05T00:00:00.000Z',
      owner: { id: 'user-1', name: 'Penguji Satu', email: 'tester@example.test' },
      upVotesBy: [],
      downVotesBy: [],
    };
    api.createComment = vi.fn(() => Promise.resolve(apiComment));
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: fakeDetail });

    // action
    const done = await asyncAddComment({ content: 'Komentar baru' })(dispatch, getState);

    // assert
    expect(api.createComment).toHaveBeenCalledTimes(1);
    expect(api.createComment).toHaveBeenCalledWith({ threadId: 'thread-1', content: 'Komentar baru' });
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      addCommentActionCreator({
        id: 'comment-9',
        content: 'Komentar baru',
        createdAt: '2024-01-05T00:00:00.000Z',
        owner: { id: 'user-1', name: 'Penguji Satu', avatar: '' },
        upVotesBy: [],
        downVotesBy: [],
      }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should show an alert and return false when the request failed', async () => {
    // arrange
    const fakeError = new Error('Komentar tidak boleh kosong');
    api.createComment = vi.fn(() => Promise.reject(fakeError));
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: fakeDetail });

    // action
    const done = await asyncAddComment({ content: '' })(dispatch, getState);

    // assert
    expect(api.createComment).toHaveBeenCalledWith({ threadId: 'thread-1', content: '' });
    expect(dispatch).toHaveBeenNthCalledWith(1, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(2, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});

describe('asyncVoteComment thunk', () => {
  it('should show an alert and call nothing when the user is not logged in', async () => {
    // arrange
    api.voteComment = vi.fn();
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: null, threadDetail: fakeDetail });

    // action
    const done = await asyncVoteComment({ commentId: 'comment-1', voteType: 1 })(dispatch, getState);

    // assert
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Masuk untuk memberi suara');
    expect(api.voteComment).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(done).toBe(false);
  });

  it('should call nothing when the comment is not in the thread detail', async () => {
    // arrange
    api.voteComment = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: fakeDetail });

    // action
    const done = await asyncVoteComment({ commentId: 'comment-404', voteType: 1 })(dispatch, getState);

    // assert
    expect(api.voteComment).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(done).toBe(false);
  });

  it('should dispatch the vote first and then call the vote API when the request succeeded', async () => {
    // arrange
    api.voteComment = vi.fn(() => Promise.resolve({ id: 'vote-1' }));
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: fakeDetail });

    // action
    const done = await asyncVoteComment({ commentId: 'comment-1', voteType: 1 })(dispatch, getState);

    // assert
    expect(api.voteComment).toHaveBeenCalledTimes(1);
    expect(api.voteComment).toHaveBeenCalledWith({
      threadId: 'thread-1', commentId: 'comment-1', voteType: 1,
    });
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      voteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(3, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(done).toBe(true);
  });

  it('should dispatch a second action with the previous vote type and show an alert when the request failed', async () => {
    // arrange
    const fakeError = new Error('Gagal memberi suara');
    const upVotedDetail = {
      ...fakeDetail,
      comments: [{ ...fakeComment, upVotesBy: ['user-1'] }],
    };
    api.voteComment = vi.fn(() => Promise.reject(fakeError));
    window.alert = vi.fn();
    const dispatch = vi.fn();
    const getState = () => ({ authUser: fakeAuthUser, threadDetail: upVotedDetail });

    // action
    const done = await asyncVoteComment({ commentId: 'comment-1', voteType: 0 })(dispatch, getState);

    // assert
    expect(api.voteComment).toHaveBeenCalledWith({
      threadId: 'thread-1', commentId: 'comment-1', voteType: 0,
    });
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      voteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1', voteType: 0 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(2, showLoading());
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      voteCommentActionCreator({ commentId: 'comment-1', userId: 'user-1', voteType: 1 }),
    );
    expect(dispatch).toHaveBeenNthCalledWith(4, hideLoading());
    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(window.alert).toHaveBeenCalledWith(fakeError.message);
    expect(done).toBe(false);
  });
});
