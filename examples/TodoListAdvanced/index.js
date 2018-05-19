import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from '../../src/react-redux';
import { createStore, combineReducers } from '../../src/redux';
import { addTask } from './actions/taskActions';
import taskReducer from './reducers/taskReducer';
import formReducer from './reducers/formReducer';
import TaskList from './containers/TaskList';

const combinedReducer = combineReducers({
  tasks: taskReducer,
  form: formReducer,
});

const store = createStore(combinedReducer);

store.dispatch(addTask('Pick up laundry'));
store.dispatch(addTask('Go running'));
store.dispatch(addTask('Take medicine'));
store.dispatch(addTask('Appointment with clients'));
store.dispatch(addTask('Do housework'));

const main = (
  <Provider store={store}>
    <TaskList />
  </Provider>
);

const app = document.getElementById('todo-list-app');
if (app) ReactDom.render(main, app);
