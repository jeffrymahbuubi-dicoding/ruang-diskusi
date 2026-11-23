import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { userShape } from '../utils';

function Navigation({ authUser = null, signOut }) {
  return (
    <header className="app-header">
      <Link to="/" className="app-brand">Ruang Diskusi</Link>
      <nav className="app-nav" aria-label="Menu utama">
        <NavLink to="/" end>Beranda</NavLink>
        <NavLink to="/leaderboards">Klasemen</NavLink>
        {authUser ? (
          <>
            <NavLink to="/new">Buat Diskusi</NavLink>
            <span className="app-nav__user">{authUser.name}</span>
            <button type="button" id="logout-button" className="button button--ghost" onClick={signOut}>
              Keluar
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Masuk</NavLink>
            <NavLink to="/register">Daftar</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

Navigation.propTypes = {
  authUser: PropTypes.shape(userShape),
  signOut: PropTypes.func.isRequired,
};

export default Navigation;
