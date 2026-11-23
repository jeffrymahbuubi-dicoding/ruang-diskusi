import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ThreadInput from '../components/ThreadInput';
import { asyncAddThread } from '../states/threads/action';

function AddThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onAddThread = async ({ title, body, category }) => {
    const done = await dispatch(asyncAddThread({ title, body, category }));

    if (done) {
      navigate('/');
    }
  };

  return (
    <section className="add-thread-page">
      <h1>Buat Diskusi</h1>
      <ThreadInput onAddThread={onAddThread} />
    </section>
  );
}

export default AddThreadPage;
