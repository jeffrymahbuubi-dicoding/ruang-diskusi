const ActionType = {
  SET_CATEGORY_FILTER: 'SET_CATEGORY_FILTER',
};

function setCategoryFilterActionCreator(category) {
  return {
    type: ActionType.SET_CATEGORY_FILTER,
    payload: {
      category,
    },
  };
}

export {
  ActionType,
  setCategoryFilterActionCreator,
};
