import React from 'react';
import TaskList from './TaskList';
import { editTask } from '../taskActions';
import { connect } from '../../../src/react-redux';

const mapStateToProps = (state) => ({
  tasks: state,
});

export default connect(mapStateToProps, { editTask })(TaskList);
