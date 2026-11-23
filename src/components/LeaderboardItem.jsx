import React from 'react';
import PropTypes from 'prop-types';
import UserAvatar from './UserAvatar';
import { userShape } from '../utils';

const leaderboardShape = {
  user: PropTypes.shape(userShape).isRequired,
  score: PropTypes.number.isRequired,
};

function LeaderboardItem({ user, score }) {
  return (
    <li className="leaderboard-item">
      <UserAvatar name={user.name} avatar={user.avatar} size={44} />
      <span className="leaderboard-item__name">{user.name}</span>
      <span className="leaderboard-item__score">{score}</span>
    </li>
  );
}

LeaderboardItem.propTypes = leaderboardShape;

export { leaderboardShape };
export default LeaderboardItem;
