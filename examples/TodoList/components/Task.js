import React from 'react';

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

export default Task;
