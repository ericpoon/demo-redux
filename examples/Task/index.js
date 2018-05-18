import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from '../../src/react-redux';
import { createStore } from '../../src/redux';
import { taskReducer } from '../../tests/fixture/taskReducer';

const Task = (props) => {
  return <p>title: {props.title}</p>;
};

const store = createStore(taskReducer, {title: 'task title', description: ''})

const mapStateToProps = (state) => {
  return {
    title: state.title
  };
}

const ConnectedTask = connect(mapStateToProps)(Task);

const main = (
  <Provider store={store}>
    <ConnectedTask />
  </Provider>
);

const app = document.getElementById('task-app');
if (app) ReactDom.render(main, app);

setInterval(() => {
  // doesn't lead to re-rendering
  store.dispatch({ type: 'CHANGE_DESCRIPTION', description: Math.random() });
}, 300);

setInterval(() => {
  store.dispatch({ type: 'CHANGE_TITLE', title: Math.random() });
}, 1000);
