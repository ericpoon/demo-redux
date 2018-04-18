setInterval(() => null, 100000);

const { createStore, applyMiddleware } = require('./redux');
const axios = require('axios');

const store = createStore({ auth: { loggedIn: false }, count: 18 });

const countReducer = function (state, action) {
  switch (action.type) {
    case 'SET_COUNT':
      return action.count;
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

const authReducer = function (state, action) {
  switch (action.type) {
    case 'LOG_IN':
      return { ...state, loggedIn: true, userName: action.userName };
    case 'LOG_OUT':
      return { ...state, loggedIn: false, userName: undefined };
    default:
      return state;
  }
};

console.log(store.getState());

store.combineReducers({
  count: countReducer,
  auth: authReducer,
});

store.dispatch({ type: 'SET_COUNT', count: 1000 });
console.log(store.getState());
store.dispatch({ type: 'INCREMENT' });
console.log(store.getState());
store.dispatch({ type: 'DECREMENT' });
console.log(store.getState());
store.dispatch({ type: 'LOG_IN', userName: 'Eric' });
console.log(store.getState());
store.dispatch({ type: 'LOG_OUT' });
console.log(store.getState());

const syncAction = function () {
  return { type: 'DECREMENT' };
};

store.dispatch(syncAction());
console.log(store.getState());

const asyncAction = async function () {
  const response = await axios.get('https://demo.api-platform.com/books/1');
  const count = response.data['isbn'];

  return { type: 'SET_COUNT', count };
};

store.dispatch(asyncAction());
console.log(store.getState());

const thunk = require('./thunk');
applyMiddleware(thunk);

const asyncAction2 = function () {

  return async (dispatch, getState) => {
    const response = await axios.get('https://demo.api-platform.com/books/1');
    const count = response.data['isbn'];
    dispatch({ type: 'SET_COUNT', count });

    console.log(store.getState());
  };
};

store.dispatch(asyncAction2());
