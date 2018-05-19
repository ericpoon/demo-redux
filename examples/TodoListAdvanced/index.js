import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from '../../src/react-redux';
import { createStore } from '../../src/redux';
import taskReducer from './taskReducer';
import TaskList from './components/TaskListContainer';

const initialState = [
  { title: 'Pick up laundry', done: false },
  { title: 'Go running', done: false },
  { title: 'Take medicine', done: false },
  { title: 'Appointment with clients', done: false },
  { title: 'Do housework', done: false },
];
const store = createStore(taskReducer, initialState);

const main = (
  <Provider store={store}>
    <TaskList />
  </Provider>
);

const app = document.getElementById('todo-list-app');
if (app) ReactDom.render(main, app);
