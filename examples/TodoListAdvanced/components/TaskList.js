import React, { Component } from 'react';
import Task from './Task';
import TaskInput from '../containers/TaskInput';

class TaskList extends Component {
  state = {
    editingIndex: -1,
  };

  onTaskClick = (idx, done) => {
    const { editTask } = this.props;
    if (done) {
      editTask(idx, { done: false });
    } else {
      editTask(idx, { done: true });
    }
  };

  renderTaskList = () => {
    const { tasks, changeTitleInputValue, removeTask } = this.props;
    return (
      <div>
        {tasks.map((t, idx) => {
          return (
            <Task
              key={t.title}
              title={t.title}
              done={t.done}
              onClick={() => this.onTaskClick(idx, t.done)}
              onEditClick={() => {
                this.setState({ editingIndex: idx });
                changeTitleInputValue(t.title);
              }}
              onDeleteClick={() => {
                if (this.state.editingIndex === idx) {
                  changeTitleInputValue('');
                  this.setState({ editingIndex: -1 });
                }
                removeTask(idx);
              }}
            />
          );
        })}
      </div>
    );
  };

  renderTaskInput = () => {
    const { addTask, editTask, changeTitleInputValue, inputTitle } = this.props;
    const { editingIndex } = this.state;
    const isEditing = editingIndex > -1;

    let label, buttonText, onSubmit;

    if (isEditing) {
      label = 'Edit task: ';
      buttonText = 'Save';
      onSubmit = () => {
        editTask(editingIndex, { title: inputTitle });
        changeTitleInputValue('');
        this.setState({ editingIndex: -1 });
      };
    } else {
      label = 'Add a new task: ';
      buttonText = 'Add';
      onSubmit = () => {
        addTask(inputTitle);
        changeTitleInputValue('');
      };
    }

    return (
      <TaskInput label={label} buttonText={buttonText} onSubmit={onSubmit} />
    );
  };

  render() {
    const { tasks } = this.props;

    return (
      <div>
        <h2>Task List</h2>
        <p>Completed: {tasks.filter(t => t.done).length}</p>
        <p>To be done: {tasks.filter(t => !t.done).length}</p>
        {this.renderTaskList()}
        {this.renderTaskInput()}
      </div>
    );
  }
}

export default TaskList;
