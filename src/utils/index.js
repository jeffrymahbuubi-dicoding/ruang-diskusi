import PropTypes from 'prop-types';

function formatDate(isoString) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(isoString));
}

function htmlToPlainText(html) {
  const parsed = new DOMParser().parseFromString(html ?? '', 'text/html');

  parsed.body.querySelectorAll('script, style, noscript, template').forEach((element) => element.remove());

  return parsed.body.textContent.trim();
}

function excerpt(text, max = 160) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max).trimEnd()}...`;
}

function getVoteType({ upVotesBy, downVotesBy }, userId) {
  if (upVotesBy.includes(userId)) {
    return 1;
  }

  if (downVotesBy.includes(userId)) {
    return -1;
  }

  return 0;
}

function applyVote({ upVotesBy, downVotesBy }, userId, voteType) {
  const upWithoutUser = upVotesBy.filter((id) => id !== userId);
  const downWithoutUser = downVotesBy.filter((id) => id !== userId);

  return {
    upVotesBy: voteType === 1 ? [...upWithoutUser, userId] : upWithoutUser,
    downVotesBy: voteType === -1 ? [...downWithoutUser, userId] : downWithoutUser,
  };
}

const userShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
};

const threadItemShape = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalComments: PropTypes.number.isRequired,
};

const commentShape = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  owner: PropTypes.shape(userShape).isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export {
  formatDate,
  htmlToPlainText,
  excerpt,
  getVoteType,
  applyVote,
  userShape,
  threadItemShape,
  commentShape,
};
