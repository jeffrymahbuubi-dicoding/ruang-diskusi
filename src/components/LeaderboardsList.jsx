import React from 'react';
import PropTypes from 'prop-types';
import LeaderboardItem, { leaderboardShape } from './LeaderboardItem';

function LeaderboardsList({ leaderboards }) {
  if (leaderboards.length === 0) {
    return <p className="leaderboards__empty">Belum ada data klasemen.</p>;
  }

  return (
    <ol className="leaderboards-list">
      {leaderboards.map((leaderboard) => (
        <LeaderboardItem key={leaderboard.user.id} {...leaderboard} />
      ))}
    </ol>
  );
}

LeaderboardsList.propTypes = {
  leaderboards: PropTypes.arrayOf(PropTypes.shape(leaderboardShape)).isRequired,
};

export default LeaderboardsList;
