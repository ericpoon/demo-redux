import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from '../../src/react-redux';
import { createStore } from '../../src/redux';

const Counter = (props) => {
  return <p>{props.count}</p>;
};

const mapStateToProps = state => ({
  count: state,
});

const ConnectedCounter = connect(mapStateToProps)(Counter);

function countReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(countReducer);

const main = (
  <Provider store={store}>
    <ConnectedCounter />
  </Provider>
);

const app = document.getElementById('counter-app');
if (app) ReactDom.render(main, app);

setInterval(() => {
  store.dispatch({ type: 'INCREMENT' });
}, 300);
