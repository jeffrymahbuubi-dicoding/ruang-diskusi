import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';

function RegisterInput({ register }) {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const onSubmit = (event) => {
    event.preventDefault();
    register({ name, email, password });
  };

  return (
    <form id="register-form" className="auth-form" onSubmit={onSubmit}>
      <div className="auth-form__field">
        <label htmlFor="register-name">Nama</label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div className="auth-form__field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div className="auth-form__field">
        <label htmlFor="register-password">Kata sandi</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          aria-describedby="register-password-hint"
          value={password}
          onChange={onPasswordChange}
        />
        <small id="register-password-hint" className="auth-form__note">Minimal 6 karakter.</small>
      </div>
      <button type="submit" id="register-submit" className="button auth-form__submit">Daftar</button>
      <p className="auth-form__hint">
        Sudah punya akun?
        {' '}
        <Link to="/login">Masuk di sini</Link>
      </p>
    </form>
  );
}

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterInput;
