import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from './react-redux';
import createStore from './createStore';
import { countReducer } from '../tests/fixture/countReducer';

let mapStateToProps = (state) => {
  return {
    count: state,
  };
};

let store = createStore(countReducer, 0);

const Counter = (props) => {
  return <p>{props.count}</p>;
};

const ConnectedCounter = connect(mapStateToProps)(Counter);

const Task = (props) => {
  // const { title, description } = props.task;
  // return <p>{title}, {description}</p>;
  return <p>{props.title}</p>;
};

// mapStateToProps = (state) => {
//   return {
//     title: state.title
//   };
// }

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return {...state, title: action.title};
    case 'CHANGE_DESCRIPTION':
      return {...state, description: action.description};
    default:
      return state;
  }
}

// store = createStore(taskReducer, {title: '123', description: ''})

const ConnectedTask = connect(mapStateToProps)(Task);

const app = (
  <Provider store={store}>
    <ConnectedCounter />
    {/*<ConnectedTask />*/}
  </Provider>
);

ReactDom.render(app, document.getElementById('app'));

setInterval(() => {
  store.dispatch({ type: 'INCREMENT' });
  store.dispatch({ type: 'CHANGE_DESCRIPTION', title: Math.random() });
}, 300);
