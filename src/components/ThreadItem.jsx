import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import VoteButtons from './VoteButtons';
import {
  excerpt, formatDate, htmlToPlainText, userShape,
} from '../utils';

function ThreadItem({
  thread, authUserId = null, onVote,
}) {
  const { owner } = thread;

  return (
    <article className="thread-item card" data-thread-id={thread.id}>
      {thread.category && <span className="thread-item__category">{`#${thread.category}`}</span>}
      <h2 className="thread-item__title">
        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
      </h2>
      <p className="thread-item__body">{excerpt(htmlToPlainText(thread.body))}</p>
      <div className="thread-item__meta">
        <UserAvatar name={owner.name} avatar={owner.avatar} size={28} />
        <span className="thread-item__owner">{owner.name}</span>
        <time className="thread-item__date" dateTime={thread.createdAt}>
          {formatDate(thread.createdAt)}
        </time>
        <span className="thread-item__comments">{`${thread.totalComments} komentar`}</span>
      </div>
      <VoteButtons
        upVotesBy={thread.upVotesBy}
        downVotesBy={thread.downVotesBy}
        authUserId={authUserId}
        onVote={(voteType) => onVote(thread.id, voteType)}
      />
    </article>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalComments: PropTypes.number.isRequired,
    owner: PropTypes.shape(userShape).isRequired,
  }).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadItem;
