import { ActionType } from './action';
import { applyVote } from '../../utils';

function threadsReducer(threads = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREADS:
      return action.payload.threads;
    case ActionType.ADD_THREAD:
      return [action.payload.thread, ...threads];
    case ActionType.VOTE_THREAD:
      return threads.map((thread) => {
        if (thread.id !== action.payload.threadId) {
          return thread;
        }

        return {
          ...thread,
          ...applyVote(thread, action.payload.userId, action.payload.voteType),
        };
      });
    default:
      return threads;
  }
}

export default threadsReducer;
