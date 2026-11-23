import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterInput from '../components/RegisterInput';
import { asyncRegisterUser } from '../states/users/action';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = async ({ name, email, password }) => {
    const done = await dispatch(asyncRegisterUser({ name, email, password }));

    if (done) {
      navigate('/login');
    }
  };

  return (
    <section className="auth-page card">
      <h1>Daftar</h1>
      <p className="auth-page__lead">Buat akun untuk ikut berdiskusi di Ruang Diskusi.</p>
      <RegisterInput register={onRegister} />
    </section>
  );
}

export default RegisterPage;
