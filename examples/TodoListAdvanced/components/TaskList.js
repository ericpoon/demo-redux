import React from 'react';
import Task from './Task';

const TaskList = (props) => {
  const { tasks, editTask } = props;
  const onTaskClick = (idx, done) => {
    if (done) {
      editTask(idx, { done: false });
    } else {
      editTask(idx, { done: true });
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

export default TaskList;
