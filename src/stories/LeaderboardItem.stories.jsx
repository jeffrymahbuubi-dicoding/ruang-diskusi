import React from 'react';
import LeaderboardItem from '../components/LeaderboardItem';

export default {
  title: 'Components/LeaderboardItem',
  component: LeaderboardItem,
  decorators: [
    (Story) => (
      <ul className="leaderboard-list">
        <Story />
      </ul>
    ),
  ],
};

export const TopScore = {
  args: {
    user: { id: 'user-1', name: 'Dian Pratama', avatar: '' },
    score: 120,
  },
};

export const LowScore = {
  args: {
    user: { id: 'user-2', name: 'Eko Wijaya', avatar: '' },
    score: 5,
  },
};
