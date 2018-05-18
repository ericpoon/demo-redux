import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from './react-redux';
import createStore from './createStore';
import { countReducer } from '../tests/fixture/countReducer';

const mapStateToProps = (state) => {
  return {
    count: state,
  };
};

const store = createStore(countReducer, 0);

const Comp = (props) => {
  return <p>{props.count}</p>;
};

const ConnectedComp = connect(mapStateToProps)(Comp);

const app = (
  <Provider store={store}>
    <ConnectedComp />
  </Provider>
);

ReactDom.render(app, document.getElementById('app'));

setInterval(() => {
  store.dispatch({ type: 'INCREMENT' });
}, 300);
