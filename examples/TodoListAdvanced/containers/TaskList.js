import React from 'react';
import TaskList from './TaskList';
import { addTask, editTask, removeTask } from '../taskActions';
import { connect } from '../../../src/react-redux';

const mapStateToProps = (state) => ({
  tasks: state,
});

export default connect(mapStateToProps, { addTask, editTask, removeTask })(TaskList);
