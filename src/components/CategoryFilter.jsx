import React from 'react';
import PropTypes from 'prop-types';

function CategoryFilter({ categories, activeCategory = '', onSelect }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter kategori">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-filter__item${category === activeCategory ? ' is-active' : ''}`}
          data-category={category}
          aria-pressed={category === activeCategory}
          onClick={() => onSelect(category)}
        >
          {`#${category}`}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
