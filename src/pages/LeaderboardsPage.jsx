import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LeaderboardsList from '../components/LeaderboardsList';
import { asyncReceiveLeaderboards } from '../states/leaderboards/action';

function LeaderboardsPage() {
  const leaderboards = useSelector((states) => states.leaderboards);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <section className="leaderboards">
      <h1 className="leaderboards__title">Klasemen Pengguna Aktif</h1>
      <LeaderboardsList leaderboards={leaderboards} />
    </section>
  );
}

export default LeaderboardsPage;
