import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginInput from '../components/LoginInput';
import { asyncSetAuthUser } from '../states/authUser/action';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogin = async ({ email, password }) => {
    const done = await dispatch(asyncSetAuthUser({ email, password }));

    if (done && location.pathname === '/login') {
      navigate('/');
    }
  };

  return (
    <section className="auth-page card">
      <h1>Masuk</h1>
      <p className="auth-page__lead">Masuk untuk membuat diskusi, berkomentar, dan memberi suara.</p>
      <LoginInput login={onLogin} />
    </section>
  );
}

export default LoginPage;
