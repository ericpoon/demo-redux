import React from 'react';
import ReactDom from 'react-dom';
import { Provider, connect } from '../../src/react-redux';
import { createStore } from '../../src/redux';
import taskReducer from './taskReducer';
import { addTask, editTask } from './taskActions';

const Task = (props) => {
  const { title, done } = props;

  return (
    <div>
      <label style={{ color: done ? 'green' : 'red', fontSize: 20, lineHeight: 2 }}>
        <input
          type={'checkbox'}
          checked={done}
          onChange={props.onClick}
        />
        {title}
      </label>
    </div>
  );
};

const TaskList = (props) => {
  const { tasks } = props;
  const onTaskClick = (idx, done) => {
    if (done) {
      store.dispatch(editTask(idx, { done: false }));
    } else {
      store.dispatch(editTask(idx, { done: true }));
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <p>Completed: {tasks.filter(t => t.done).length}</p>
      <p>To be done: {tasks.filter(t => !t.done).length}</p>
      {tasks.map((t, idx) => {
        return (
          <Task
            key={t.title}
            title={t.title}
            done={t.done}
            onClick={() => onTaskClick(idx, t.done)}
          />
        );
      })}
    </div>
  );
};

const store = createStore(taskReducer);

const mapStateToProps = (state) => {
  return {
    tasks: state,
  };
};

const ConnectedTaskList = connect(mapStateToProps)(TaskList);

const main = (
  <Provider store={store}>
    <ConnectedTaskList />
  </Provider>
);

const app = document.getElementById('todo-list-app');
if (app) ReactDom.render(main, app);

store.dispatch(addTask('Pick up laundry'));
store.dispatch(addTask('Go running'));
store.dispatch(addTask('Take medicine'));
store.dispatch(addTask('Appointment with clients'));
store.dispatch(addTask('Do housework'));
