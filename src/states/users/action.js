import { hideLoading, showLoading } from '@dimasmds/react-redux-loading-bar';
import api from '../../utils/api';

const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    let done = false;

    try {
      await api.register({ name, email, password });
      done = true;
    } catch (error) {
      alert(error.message);
    }

    dispatch(hideLoading());
    return done;
  };
}

export {
  ActionType,
  receiveUsersActionCreator,
  asyncRegisterUser,
};
