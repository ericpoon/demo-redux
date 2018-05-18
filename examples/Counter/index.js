import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from '../../src/react-redux';
import { createStore } from '../../src/redux';
import { countReducer } from '../../tests/fixture/countReducer';

const Counter = (props) => {
  return <p>{props.count}</p>;
};

const mapStateToProps = state => ({
  count: state,
});

const ConnectedCounter = connect(mapStateToProps)(Counter);

const store = createStore(countReducer, 0);

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
