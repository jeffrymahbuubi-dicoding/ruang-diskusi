/**
 * skenario pengujian
 *
 * - threadDetailReducer
 *   - should start from null when the action type is not known
 *   - should return the thread detail when given the RECEIVE_THREAD_DETAIL action
 *   - should return null when given the CLEAR_THREAD_DETAIL action
 *   - should add the user to upVotesBy when given the VOTE_THREAD_DETAIL action with vote type 1
 *   - should move the user to downVotesBy when given the VOTE_THREAD_DETAIL action with vote type -1
 *   - should remove the user from both lists when given the VOTE_THREAD_DETAIL action with vote type 0
 *   - should put the new comment first when given the ADD_COMMENT action
 *   - should change only the named comment when given the VOTE_COMMENT action
 *   - should keep the comments unchanged when the VOTE_COMMENT action names an unknown comment id
 *   - should stay null when VOTE_THREAD_DETAIL, ADD_COMMENT or VOTE_COMMENT arrive while the state is null
 */
import { describe, it, expect } from 'vitest';
import threadDetailReducer from './reducer';
import { ActionType } from './action';

const commentOne = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-03T00:00:00.000Z',
  owner: { id: 'user-2', name: 'Penguji Dua', avatar: '' },
  upVotesBy: [],
  downVotesBy: ['user-5'],
};
const commentTwo = {
  id: 'comment-2',
  content: 'Komentar kedua',
  createdAt: '2024-01-04T00:00:00.000Z',
  owner: { id: 'user-3', name: 'Penguji Tiga', avatar: '' },
  upVotesBy: ['user-5'],
  downVotesBy: [],
};
const detail = {
  id: 'thread-1',
  title: 'Judul diskusi',
  body: 'Isi diskusi',
  category: 'redux',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'Penguji Satu', avatar: '' },
  upVotesBy: ['user-5'],
  downVotesBy: [],
  comments: [commentOne, commentTwo],
};

describe('threadDetailReducer', () => {
  it('should start from null when the action type is not known', () => {
    // arrange
    const initialState = undefined;
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('should return the thread detail when given the RECEIVE_THREAD_DETAIL action', () => {
    // arrange
    const initialState = null;
    const action = {
      type: ActionType.RECEIVE_THREAD_DETAIL,
      payload: { threadDetail: detail },
    };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toEqual(detail);
  });

  it('should return null when given the CLEAR_THREAD_DETAIL action', () => {
    // arrange
    const initialState = detail;
    const action = { type: ActionType.CLEAR_THREAD_DETAIL };

    // action
    const nextState = threadDetailReducer(initialState, action);

    // assert
    expect(nextState).toBeNull();
  });

  it('should add the user to upVotesBy when given the VOTE_THREAD_DETAIL action with vote type 1', () => {
    // arrange
    const action = {
      type: ActionType.VOTE_THREAD_DETAIL,
      payload: { userId: 'user-9', voteType: 1 },
    };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState).toEqual({ ...detail, upVotesBy: ['user-5', 'user-9'] });
  });

  it('should move the user to downVotesBy when given the VOTE_THREAD_DETAIL action with vote type -1', () => {
    // arrange
    const action = {
      type: ActionType.VOTE_THREAD_DETAIL,
      payload: { userId: 'user-5', voteType: -1 },
    };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState.upVotesBy).toEqual([]);
    expect(nextState.downVotesBy).toEqual(['user-5']);
    expect(nextState.comments).toEqual(detail.comments);
  });

  it('should remove the user from both lists when given the VOTE_THREAD_DETAIL action with vote type 0', () => {
    // arrange
    const action = {
      type: ActionType.VOTE_THREAD_DETAIL,
      payload: { userId: 'user-5', voteType: 0 },
    };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState.upVotesBy).toEqual([]);
    expect(nextState.downVotesBy).toEqual([]);
  });

  it('should put the new comment first when given the ADD_COMMENT action', () => {
    // arrange
    const newComment = {
      id: 'comment-3',
      content: 'Komentar baru',
      createdAt: '2024-01-05T00:00:00.000Z',
      owner: { id: 'user-1', name: 'Penguji Satu', avatar: '' },
      upVotesBy: [],
      downVotesBy: [],
    };
    const action = { type: ActionType.ADD_COMMENT, payload: { comment: newComment } };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState.comments).toEqual([newComment, commentOne, commentTwo]);
    expect(nextState.title).toBe(detail.title);
  });

  it('should change only the named comment when given the VOTE_COMMENT action', () => {
    // arrange
    const action = {
      type: ActionType.VOTE_COMMENT,
      payload: { commentId: 'comment-1', userId: 'user-9', voteType: 1 },
    };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState.comments[0].upVotesBy).toEqual(['user-9']);
    expect(nextState.comments[0].downVotesBy).toEqual(['user-5']);
    expect(nextState.comments[1]).toEqual(commentTwo);
    expect(nextState.upVotesBy).toEqual(detail.upVotesBy);
  });

  it('should keep the comments unchanged when the VOTE_COMMENT action names an unknown comment id', () => {
    // arrange
    const action = {
      type: ActionType.VOTE_COMMENT,
      payload: { commentId: 'comment-404', userId: 'user-9', voteType: 1 },
    };

    // action
    const nextState = threadDetailReducer(detail, action);

    // assert
    expect(nextState.comments).toEqual([commentOne, commentTwo]);
  });

  it('should stay null when VOTE_THREAD_DETAIL, ADD_COMMENT or VOTE_COMMENT arrive while the state is null', () => {
    // arrange
    const actions = [
      { type: ActionType.VOTE_THREAD_DETAIL, payload: { userId: 'user-9', voteType: 1 } },
      { type: ActionType.ADD_COMMENT, payload: { comment: commentOne } },
      {
        type: ActionType.VOTE_COMMENT,
        payload: { commentId: 'comment-1', userId: 'user-9', voteType: 1 },
      },
    ];

    // action
    const nextStates = actions.map((action) => threadDetailReducer(null, action));

    // assert
    expect(nextStates).toEqual([null, null, null]);
  });
});
