const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';
  const VOTE_PATHS = {
    1: 'up-vote',
    '-1': 'down-vote',
    0: 'neutral-vote',
  };

  function putAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }

  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async function readResponse(response) {
    let responseJson;

    try {
      responseJson = await response.json();
    } catch {
      throw new Error('Server memberikan jawaban yang tidak dapat dibaca');
    }

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message);
    }

    return responseJson.data;
  }

  async function fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  function jsonRequest(method, body) {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  async function register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, jsonRequest('POST', { name, email, password }));
    const { user } = await readResponse(response);

    return user;
  }

  async function login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, jsonRequest('POST', { email, password }));
    const { token } = await readResponse(response);

    return token;
  }

  async function getOwnProfile() {
    const response = await fetchWithAuth(`${BASE_URL}/users/me`);
    const { user } = await readResponse(response);

    return user;
  }

  async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    const { users } = await readResponse(response);

    return users;
  }

  async function getAllThreads() {
    const response = await fetch(`${BASE_URL}/threads`);
    const { threads } = await readResponse(response);

    return threads;
  }

  async function getThreadDetail(threadId) {
    const response = await fetch(`${BASE_URL}/threads/${threadId}`);
    const { detailThread } = await readResponse(response);

    return detailThread;
  }

  async function createThread({ title, body, category }) {
    const payload = category ? { title, body, category } : { title, body };
    const response = await fetchWithAuth(`${BASE_URL}/threads`, jsonRequest('POST', payload));
    const { thread } = await readResponse(response);

    return thread;
  }

  async function createComment({ threadId, content }) {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments`,
      jsonRequest('POST', { content }),
    );
    const { comment } = await readResponse(response);

    return comment;
  }

  async function voteThread({ threadId, voteType }) {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/${VOTE_PATHS[voteType]}`,
      { method: 'POST' },
    );
    const { vote } = await readResponse(response);

    return vote;
  }

  async function voteComment({ threadId, commentId, voteType }) {
    const response = await fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/${VOTE_PATHS[voteType]}`,
      { method: 'POST' },
    );
    const { vote } = await readResponse(response);

    return vote;
  }

  async function getLeaderboards() {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const { leaderboards } = await readResponse(response);

    return leaderboards;
  }

  return {
    putAccessToken,
    getAccessToken,
    register,
    login,
    getOwnProfile,
    getAllUsers,
    getAllThreads,
    getThreadDetail,
    createThread,
    createComment,
    voteThread,
    voteComment,
    getLeaderboards,
  };
})();

export default api;
