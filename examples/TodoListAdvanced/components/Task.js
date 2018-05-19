import React from 'react';

const Task = (props) => {
  const { title, done, onEditClick, onDeleteClick } = props;

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
      <button onClick={onEditClick}>Edit</button>
      <button onClick={onDeleteClick}>Delete</button>
      <hr />
    </div>
  );
};

export default Task;
