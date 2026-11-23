import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import '../src/styles/style.css';
import '../src/styles/auth.css';
import '../src/styles/threads.css';
import '../src/styles/detail.css';
import '../src/styles/leaderboards.css';

const preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
