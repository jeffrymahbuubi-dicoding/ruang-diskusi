import CategoryFilter from '../components/CategoryFilter';

const categories = ['react', 'redux', 'testing', 'umum'];
const onSelect = () => {};

export default {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
};

export const NoneActive = {
  args: {
    categories,
    activeCategory: '',
    onSelect,
  },
};

export const OneActive = {
  args: {
    categories,
    activeCategory: 'redux',
    onSelect,
  },
};
