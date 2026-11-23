import React from 'react';
import PropTypes from 'prop-types';
import ThreadItem from './ThreadItem';
import { threadItemShape, userShape } from '../utils';

function ThreadsList({ threads, authUserId = null, onVote }) {
  if (threads.length === 0) {
    return <p className="threads-list__empty">Belum ada diskusi yang cocok.</p>;
  }

  return (
    <section className="threads-list" aria-label="Daftar diskusi">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} authUserId={authUserId} onVote={onVote} />
      ))}
    </section>
  );
}

ThreadsList.propTypes = {
  threads: PropTypes.arrayOf(PropTypes.shape({
    ...threadItemShape,
    owner: PropTypes.shape(userShape).isRequired,
  })).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
};

export default ThreadsList;
