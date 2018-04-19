const initialState = { loggedIn: false };

function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return { loggedIn: true, userName: action.userName };
    case 'LOGOUT':
      return { loggedIn: false };
    default:
      return state;
  }
}

module.exports = { authReducer, initialState };
