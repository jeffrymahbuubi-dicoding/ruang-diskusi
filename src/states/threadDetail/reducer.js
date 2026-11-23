import { ActionType } from './action';
import { applyVote } from '../../utils';

function threadDetailReducer(threadDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_THREAD_DETAIL:
      return action.payload.threadDetail;
    case ActionType.CLEAR_THREAD_DETAIL:
      return null;
    case ActionType.VOTE_THREAD_DETAIL:
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        ...applyVote(threadDetail, action.payload.userId, action.payload.voteType),
      };
    case ActionType.ADD_COMMENT:
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        comments: [action.payload.comment, ...threadDetail.comments],
      };
    case ActionType.VOTE_COMMENT:
      if (!threadDetail) {
        return threadDetail;
      }
      return {
        ...threadDetail,
        comments: threadDetail.comments.map((comment) => (
          comment.id === action.payload.commentId
            ? { ...comment, ...applyVote(comment, action.payload.userId, action.payload.voteType) }
            : comment
        )),
      };
    default:
      return threadDetail;
  }
}

export default threadDetailReducer;
