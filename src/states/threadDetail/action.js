import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { getVoteType } from '../../utils';

const ActionType = {
  RECEIVE_THREAD_DETAIL: 'RECEIVE_THREAD_DETAIL',
  CLEAR_THREAD_DETAIL: 'CLEAR_THREAD_DETAIL',
  VOTE_THREAD_DETAIL: 'VOTE_THREAD_DETAIL',
  ADD_COMMENT: 'ADD_COMMENT',
  VOTE_COMMENT: 'VOTE_COMMENT',
};

function receiveThreadDetailActionCreator(threadDetail) {
  return {
    type: ActionType.RECEIVE_THREAD_DETAIL,
    payload: {
      threadDetail,
    },
  };
}

function clearThreadDetailActionCreator() {
  return {
    type: ActionType.CLEAR_THREAD_DETAIL,
  };
}

function voteThreadDetailActionCreator({ userId, voteType }) {
  return {
    type: ActionType.VOTE_THREAD_DETAIL,
    payload: {
      userId,
      voteType,
    },
  };
}

function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment,
    },
  };
}

function voteCommentActionCreator({ commentId, userId, voteType }) {
  return {
    type: ActionType.VOTE_COMMENT,
    payload: {
      commentId,
      userId,
      voteType,
    },
  };
}

function asyncReceiveThreadDetail(threadId) {
  return async (dispatch) => {
    dispatch(clearThreadDetailActionCreator());
    dispatch(showLoading());
    let done = false;

    try {
      const threadDetail = await api.getThreadDetail(threadId);
      dispatch(receiveThreadDetailActionCreator(threadDetail));
      done = true;
    } catch (error) {
      alert(error.message);
    }

    dispatch(hideLoading());
    return done;
  };
}

function asyncVoteThreadDetail(voteType) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Masuk untuk memberi suara');
      return false;
    }

    if (!threadDetail) {
      return false;
    }

    const previousVoteType = getVoteType(threadDetail, authUser.id);
    let done = false;

    dispatch(voteThreadDetailActionCreator({ userId: authUser.id, voteType }));
    dispatch(showLoading());

    try {
      await api.voteThread({ threadId: threadDetail.id, voteType });
      done = true;
    } catch (error) {
      alert(error.message);
      dispatch(voteThreadDetailActionCreator({ userId: authUser.id, voteType: previousVoteType }));
    }

    dispatch(hideLoading());
    return done;
  };
}

function asyncAddComment({ content }) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser || !threadDetail) {
      return false;
    }

    dispatch(showLoading());
    let done = false;

    try {
      const comment = await api.createComment({ threadId: threadDetail.id, content });
      // The API answers with the owner's id, name and e-mail only, so the owner is rebuilt from the logged in user.
      dispatch(addCommentActionCreator({
        ...comment,
        owner: { id: authUser.id, name: authUser.name, avatar: authUser.avatar },
      }));
      done = true;
    } catch (error) {
      alert(error.message);
    }

    dispatch(hideLoading());
    return done;
  };
}

function asyncVoteComment({ commentId, voteType }) {
  return async (dispatch, getState) => {
    const { authUser, threadDetail } = getState();

    if (!authUser) {
      alert('Masuk untuk memberi suara');
      return false;
    }

    const target = threadDetail?.comments.find((comment) => comment.id === commentId);

    if (!target) {
      return false;
    }

    const previousVoteType = getVoteType(target, authUser.id);
    let done = false;

    dispatch(voteCommentActionCreator({ commentId, userId: authUser.id, voteType }));
    dispatch(showLoading());

    try {
      await api.voteComment({ threadId: threadDetail.id, commentId, voteType });
      done = true;
    } catch (error) {
      alert(error.message);
      dispatch(voteCommentActionCreator({ commentId, userId: authUser.id, voteType: previousVoteType }));
    }

    dispatch(hideLoading());
    return done;
  };
}

export {
  ActionType,
  receiveThreadDetailActionCreator,
  clearThreadDetailActionCreator,
  voteThreadDetailActionCreator,
  addCommentActionCreator,
  voteCommentActionCreator,
  asyncReceiveThreadDetail,
  asyncVoteThreadDetail,
  asyncAddComment,
  asyncVoteComment,
};
