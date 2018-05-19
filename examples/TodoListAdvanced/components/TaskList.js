import React, { Component } from 'react';
import Task from './Task';

class TaskList extends Component {
  onTaskClick = (idx, done) => {
    const { editTask } = this.props;
    if (done) {
      editTask(idx, { done: false });
    } else {
      editTask(idx, { done: true });
    }
  };

  renderTaskList = () => {
    const { tasks } = this.props;
    return (
      <div>
        {tasks.map((t, idx) => {
          return (
            <Task
              key={t.title}
              title={t.title}
              done={t.done}
              onClick={() => this.onTaskClick(idx, t.done)}
            />
          );
        })}
      </div>
    );
  };

  renderTaskForm = () => {

  };

  render() {
    const { tasks } = this.props;

    return (
      <div>
        <h2>Task List</h2>
        <p>Completed: {tasks.filter(t => t.done).length}</p>
        <p>To be done: {tasks.filter(t => !t.done).length}</p>
        {this.renderTaskList()}
        {this.renderTaskForm()}
      </div>
    );
  }
}

export default TaskList;
