import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function CommentInput({ isLoggedIn, addComment }) {
  const [content, onContentChange, setContent] = useInput('');

  if (!isLoggedIn) {
    return (
      <p className="comment-login-hint">
        <Link to="/login">Masuk</Link>
        {' '}
        untuk menulis komentar.
      </p>
    );
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (content.trim() === '') {
      return;
    }

    const done = await addComment(content.trim());

    if (done) {
      setContent('');
    }
  };

  return (
    <form id="comment-form" className="comment-form card" onSubmit={onSubmit}>
      <label htmlFor="comment-content">Tulis komentar</label>
      <textarea
        id="comment-content"
        value={content}
        onChange={onContentChange}
        placeholder="Bagikan pendapat Anda"
        required
      />
      <button id="comment-submit" type="submit" className="button">Kirim komentar</button>
    </form>
  );
}

CommentInput.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  addComment: PropTypes.func.isRequired,
};

export default CommentInput;
