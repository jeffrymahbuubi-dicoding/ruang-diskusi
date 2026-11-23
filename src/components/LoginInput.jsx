import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function LoginInput({ login }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmit = (event) => {
    event.preventDefault();
    login({ email, password });
  };

  return (
    <form id="login-form" className="auth-form" onSubmit={onSubmit}>
      <div className="auth-form__field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div className="auth-form__field">
        <label htmlFor="login-password">Kata sandi</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={onPasswordChange}
        />
      </div>
      <button type="submit" id="login-submit" className="button auth-form__submit">Masuk</button>
      <p className="auth-form__hint">
        Belum punya akun?
        {' '}
        <Link to="/register">Daftar di sini</Link>
      </p>
    </form>
  );
}

LoginInput.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginInput;
