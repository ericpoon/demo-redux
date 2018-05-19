import React from 'react';
import TaskInput from '../components/TaskInput';
import { changeTitleInputValue } from '../actions/formActions';

const mapStateToProps = (state) => ({
  title: state.form.title,
});

export default connect(mapStateToProps, { onTitleChange: changeTitleInputValue })(TaskInput);
