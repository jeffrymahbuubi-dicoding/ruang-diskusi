import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import Navigation from './components/Navigation';
import AddThreadPage from './pages/AddThreadPage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';

function App() {
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }

  return (
    <>
      <Loading />
      <Navigation authUser={authUser} signOut={onSignOut} />
      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:threadId" element={<DetailPage />} />
          <Route path="/new" element={authUser ? <AddThreadPage /> : <LoginPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/login" element={authUser ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={authUser ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
