import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';
import VoteButtons from './VoteButtons';
import { formatDate, htmlToPlainText, userShape } from '../utils';

function ThreadDetail({
  title, body, category = '', createdAt, owner, upVotesBy, downVotesBy, authUserId = null, onVote,
}) {
  return (
    <article className="thread-detail card">
      {category && <span className="thread-detail__category">{`#${category}`}</span>}
      <h1 className="thread-detail__title">{title}</h1>
      <div className="thread-detail__meta">
        <UserAvatar name={owner.name} avatar={owner.avatar} size={36} />
        <span className="thread-detail__owner">{owner.name}</span>
        <time className="thread-detail__date" dateTime={createdAt}>{formatDate(createdAt)}</time>
      </div>
      <div className="thread-detail__body">{htmlToPlainText(body)}</div>
      <VoteButtons
        upVotesBy={upVotesBy}
        downVotesBy={downVotesBy}
        authUserId={authUserId}
        onVote={onVote}
      />
    </article>
  );
}

ThreadDetail.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  owner: PropTypes.shape(userShape).isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadDetail;
