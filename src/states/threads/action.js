import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';
import { getVoteType } from '../../utils';

const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  VOTE_THREAD: 'VOTE_THREAD',
};

function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

function voteThreadActionCreator({ threadId, userId, voteType }) {
  return {
    type: ActionType.VOTE_THREAD,
    payload: {
      threadId,
      userId,
      voteType,
    },
  };
}

function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    dispatch(showLoading());
    let done = false;

    try {
      const thread = await api.createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
      done = true;
    } catch (error) {
      alert(error.message);
    }

    dispatch(hideLoading());
    return done;
  };
}

function asyncVoteThread({ threadId, voteType }) {
  return async (dispatch, getState) => {
    const { authUser, threads } = getState();
    const thread = threads.find((item) => item.id === threadId);

    if (!authUser) {
      alert('Masuk untuk memberi suara');
      return false;
    }

    if (!thread) {
      return false;
    }

    const previousVoteType = getVoteType(thread, authUser.id);
    let done = false;

    dispatch(showLoading());
    dispatch(voteThreadActionCreator({ threadId, userId: authUser.id, voteType }));

    try {
      await api.voteThread({ threadId, voteType });
      done = true;
    } catch (error) {
      dispatch(voteThreadActionCreator({ threadId, userId: authUser.id, voteType: previousVoteType }));
      alert(error.message);
    }

    dispatch(hideLoading());
    return done;
  };
}

export {
  ActionType,
  receiveThreadsActionCreator,
  addThreadActionCreator,
  voteThreadActionCreator,
  asyncAddThread,
  asyncVoteThread,
};
