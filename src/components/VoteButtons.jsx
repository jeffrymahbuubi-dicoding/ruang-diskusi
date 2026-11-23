import React from 'react';
import PropTypes from 'prop-types';
import { FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { getVoteType } from '../utils';

function VoteButtons({
  upVotesBy, downVotesBy, authUserId = null, onVote,
}) {
  const current = authUserId ? getVoteType({ upVotesBy, downVotesBy }, authUserId) : 0;
  const isUp = current === 1;
  const isDown = current === -1;

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-button${isUp ? ' is-active' : ''}`}
        data-vote="up"
        aria-pressed={isUp}
        aria-label="Suka"
        onClick={() => onVote(isUp ? 0 : 1)}
      >
        {isUp ? <FaThumbsUp aria-hidden="true" /> : <FaRegThumbsUp aria-hidden="true" />}
      </button>
      <span className="vote-count" data-count="up">{upVotesBy.length}</span>
      <button
        type="button"
        className={`vote-button${isDown ? ' is-active' : ''}`}
        data-vote="down"
        aria-pressed={isDown}
        aria-label="Tidak suka"
        onClick={() => onVote(isDown ? 0 : -1)}
      >
        {isDown ? <FaThumbsDown aria-hidden="true" /> : <FaRegThumbsDown aria-hidden="true" />}
      </button>
      <span className="vote-count" data-count="down">{downVotesBy.length}</span>
    </div>
  );
}

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default VoteButtons;
