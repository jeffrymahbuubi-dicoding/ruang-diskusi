import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';
import VoteButtons from './VoteButtons';
import { formatDate, htmlToPlainText, userShape } from '../utils';

function CommentItem({
  id, content, createdAt, owner, upVotesBy, downVotesBy, authUserId = null, onVote,
}) {
  return (
    <article className="comment-item card" data-comment-id={id}>
      <div className="comment-item__meta">
        <UserAvatar name={owner.name} avatar={owner.avatar} size={32} />
        <span className="comment-item__owner">{owner.name}</span>
        <time className="comment-item__date" dateTime={createdAt}>{formatDate(createdAt)}</time>
      </div>
      <div className="comment-item__content">{htmlToPlainText(content)}</div>
      <VoteButtons
        upVotesBy={upVotesBy}
        downVotesBy={downVotesBy}
        authUserId={authUserId}
        onVote={(voteType) => onVote(id, voteType)}
      />
    </article>
  );
}

CommentItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  owner: PropTypes.shape(userShape).isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default CommentItem;
