export const addTask = (title) => ({
  type: 'ADD_TASK',
  title,
});

export const removeTask = (index) => ({
  type: 'REMOVE_TASK',
  index,
});

export const editTask = (index, { title, done }) => ({
  type: 'EDIT_TASK',
  index,
  title,
  done,
});
