import UserAvatar from '../components/UserAvatar';

export default {
  title: 'Components/UserAvatar',
  component: UserAvatar,
};

export const Initial = {
  args: {
    name: 'Citra Lestari',
    avatar: '',
  },
};

export const Small = {
  args: {
    name: 'Budi Santoso',
    avatar: '',
    size: 24,
  },
};

export const Large = {
  args: {
    name: 'Wulan Dewi',
    avatar: '',
    size: 96,
  },
};
