import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ThreadDetail from '../components/ThreadDetail';
import CommentInput from '../components/CommentInput';
import CommentsList from '../components/CommentsList';
import {
  asyncAddComment,
  asyncReceiveThreadDetail,
  asyncVoteComment,
  asyncVoteThreadDetail,
  clearThreadDetailActionCreator,
} from '../states/threadDetail/action';

function DetailPage() {
  const { threadId } = useParams();
  const authUser = useSelector((states) => states.authUser);
  const threadDetail = useSelector((states) => states.threadDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(threadId));

    return () => {
      dispatch(clearThreadDetailActionCreator());
    };
  }, [threadId, dispatch]);

  const onVoteThread = (voteType) => {
    dispatch(asyncVoteThreadDetail(voteType));
  };

  const onVoteComment = (commentId, voteType) => {
    dispatch(asyncVoteComment({ commentId, voteType }));
  };

  const onAddComment = (content) => dispatch(asyncAddComment({ content }));

  if (!threadDetail) {
    return null;
  }

  const authUserId = authUser ? authUser.id : null;

  return (
    <section className="detail-page">
      <ThreadDetail {...threadDetail} authUserId={authUserId} onVote={onVoteThread} />
      <CommentInput isLoggedIn={Boolean(authUser)} addComment={onAddComment} />
      <CommentsList
        comments={threadDetail.comments}
        authUserId={authUserId}
        onVote={onVoteComment}
      />
    </section>
  );
}

export default DetailPage;
