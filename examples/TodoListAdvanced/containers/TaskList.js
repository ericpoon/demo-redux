import React from 'react';
import TaskList from '../components/TaskList';
import { addTask, editTask, removeTask } from '../actions/taskActions';
import { changeTitleInputValue } from '../actions/formActions';
import { connect } from '../../../src/react-redux';

const mapStateToProps = (state) => ({
  tasks: state.tasks,
  inputTitle: state.form.title,
});

export default connect(mapStateToProps, { addTask, editTask, removeTask, changeTitleInputValue })(TaskList);
