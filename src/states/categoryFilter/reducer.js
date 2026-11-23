import { ActionType } from './action';

function categoryFilterReducer(categoryFilter = '', action = {}) {
  switch (action.type) {
    case ActionType.SET_CATEGORY_FILTER:
      return action.payload.category;
    default:
      return categoryFilter;
  }
}

export default categoryFilterReducer;
