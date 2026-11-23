import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h1>Halaman tidak ditemukan</h1>
      <p>Alamat yang Anda buka tidak ada di Ruang Diskusi.</p>
      <Link to="/" className="button">Kembali ke beranda</Link>
    </section>
  );
}

export default NotFoundPage;
