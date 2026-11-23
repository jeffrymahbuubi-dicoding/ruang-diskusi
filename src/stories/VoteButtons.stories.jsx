import VoteButtons from '../components/VoteButtons';

const onVote = () => {};

export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
};

export const Neutral = {
  args: {
    upVotesBy: ['user-2', 'user-3'],
    downVotesBy: ['user-4'],
    authUserId: 'user-1',
    onVote,
  },
};

export const UpVoted = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3'],
    downVotesBy: ['user-4'],
    authUserId: 'user-1',
    onVote,
  },
};

export const DownVoted = {
  args: {
    upVotesBy: ['user-2'],
    downVotesBy: ['user-1', 'user-4'],
    authUserId: 'user-1',
    onVote,
  },
};
