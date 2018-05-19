import React, { Component } from 'react';

class TaskInput extends Component {
  render() {
    const { label, buttonText, onSubmit, title, onTitleChange } = this.props;
    return (
      <div>
        {label}
        <input
          type={'text'}
          value={title}
          onChange={e => {
            onTitleChange(e.target.value);
          }}
        />
        <button onClick={onSubmit}>{buttonText}</button>
      </div>
    );
  }
}

export default TaskInput;
