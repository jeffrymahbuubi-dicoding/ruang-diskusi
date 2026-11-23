import React from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';
import { commentShape } from '../utils';

function CommentsList({ comments, authUserId = null, onVote }) {
  return (
    <section className="comments-list">
      <h2>{`Komentar (${comments.length})`}</h2>
      {comments.length === 0 && <p className="comments-list__empty">Belum ada komentar.</p>}
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          authUserId={authUserId}
          onVote={onVote}
        />
      ))}
    </section>
  );
}

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape(commentShape)).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentsList;
