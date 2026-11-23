import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CategoryFilter from '../components/CategoryFilter';
import ThreadsList from '../components/ThreadsList';
import { setCategoryFilterActionCreator } from '../states/categoryFilter/action';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';
import { asyncVoteThread } from '../states/threads/action';

function HomePage() {
  const threads = useSelector((states) => states.threads);
  const users = useSelector((states) => states.users);
  const authUser = useSelector((states) => states.authUser);
  const categoryFilter = useSelector((states) => states.categoryFilter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads());
  }, [dispatch]);

  const onVote = (threadId, voteType) => {
    dispatch(asyncVoteThread({ threadId, voteType }));
  };

  const onSelectCategory = (category) => {
    dispatch(setCategoryFilterActionCreator(category === categoryFilter ? '' : category));
  };

  const categories = [...new Set(threads.map((thread) => thread.category).filter(Boolean))];

  // sort() mutates its array, so it runs on a copy: Redux state must not be changed in place.
  const threadsWithOwner = [...threads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((thread) => !categoryFilter || thread.category === categoryFilter)
    .map((thread) => ({
      ...thread,
      owner: users.find((user) => user.id === thread.ownerId)
        ?? { id: thread.ownerId, name: 'Pengguna tidak dikenal' },
    }));

  return (
    <section className="home-page">
      <h1>Diskusi</h1>
      <CategoryFilter
        categories={categories}
        activeCategory={categoryFilter}
        onSelect={onSelectCategory}
      />
      <ThreadsList
        threads={threadsWithOwner}
        authUserId={authUser ? authUser.id : null}
        onVote={onVote}
      />
    </section>
  );
}

export default HomePage;
