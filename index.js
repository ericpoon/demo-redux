setInterval(() => null, 100000);

const { createStore, combineReducers } = require('./src/redux');
const axios = require('axios');

const countReducer = function (state = 0, action) {

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
const authReducer = function (state = { loggedIn: false }, action) {

  switch (action.type) {
    case 'LOG_IN':
      return { ...state, loggedIn: true, userName: action.userName };
    case 'LOG_OUT':
      return { ...state, loggedIn: false, userName: undefined };
    default:
      return state;
  }
};

const combinedReducer = combineReducers({
  count: countReducer,
  auth: authReducer,
});

const thunk = require('./src/enhancers/thunk');

const store = createStore({ auth: { loggedIn: false }, count: 18 }, combinedReducer, thunk);

// console.log(store.getState());
//
// store.dispatch({ type: 'SET_COUNT', count: 1000 });
// console.log(store.getState());
// store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState());
// store.dispatch({ type: 'DECREMENT' });
// console.log(store.getState());
// store.dispatch({ type: 'LOG_IN', userName: 'Eric' });
// console.log(store.getState());
// store.dispatch({ type: 'LOG_OUT' });
// console.log(store.getState());
//
// const syncAction = function () {
//   return { type: 'DECREMENT' };
// };
//
// store.dispatch(syncAction());
// console.log(store.getState());
//
// const asyncAction = async function () {
//   const response = await axios.get('https://demo.api-platform.com/books/1');
//   const count = response.data['isbn'];
//
//   return { type: 'SET_COUNT', count };
// };
//
// store.dispatch(asyncAction());
// console.log(store.getState());

const asyncAction2 = function () {

  return async (dispatch, getState) => {
    const response = await axios.get('https://demo.api-platform.com/books/1');
    const count = response.data['isbn'];
    dispatch({ type: 'SET_COUNT', count });

    console.log(store.getState());
  };
};

store.dispatch(asyncAction2());

// const { createStore, combineReducers, compose } = require('./src/redux');
// const countReducer = function (state = 0, action) {
//   switch (action.type) {
//     case 'SET_COUNT':
//       return action.count;
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default:
//       return state;
//   }
// };
// const authReducer = function (state = { loggedIn: false }, action) {
//
//   switch (action.type) {
//     case 'LOG_IN':
//       return { ...state, loggedIn: true, userName: action.userName };
//     case 'LOG_OUT':
//       return { ...state, loggedIn: false, userName: undefined };
//     default:
//       return state;
//   }
// };
//
// const reducer = combineReducers({
//   count: countReducer,
//   auth: authReducer,
// });
//
// const logger = require('./src/enhancers/loggerEnhancer');
// const timestamper = require('./src/enhancers/timestampEnhancer');
//
// const store = createStore(undefined, reducer, compose(timestamper, logger));
//
// store.dispatch({ type: 'INCREMENT' });
// store.dispatch({ type: 'INCREMENT' });
// store.dispatch({ type: 'INCREMENT' });
// store.getState();
