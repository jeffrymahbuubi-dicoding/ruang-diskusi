import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';

function ThreadInput({ onAddThread }) {
  const [title, onTitleChange] = useInput('');
  const [category, onCategoryChange] = useInput('');
  const [body, onBodyChange] = useInput('');

  const onSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    onAddThread({ title: title.trim(), body: body.trim(), category: category.trim() });
  };

  return (
    <form id="thread-form" className="thread-form card" onSubmit={onSubmit}>
      <div className="thread-form__field">
        <label htmlFor="thread-title">Judul</label>
        <input id="thread-title" type="text" value={title} onChange={onTitleChange} required />
      </div>
      <div className="thread-form__field">
        <label htmlFor="thread-category">Kategori (opsional)</label>
        <input id="thread-category" type="text" value={category} onChange={onCategoryChange} />
      </div>
      <div className="thread-form__field">
        <label htmlFor="thread-body">Isi diskusi</label>
        <textarea id="thread-body" value={body} onChange={onBodyChange} required />
      </div>
      <button type="submit" id="thread-submit" className="button">Kirim diskusi</button>
    </form>
  );
}

ThreadInput.propTypes = {
  onAddThread: PropTypes.func.isRequired,
};

export default ThreadInput;
