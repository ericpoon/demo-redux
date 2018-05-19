const initialState = [];

function taskReducer(state = initialState, action) {
  switch (action.type) {
  case 'ADD_TASK':
    return [...state, { title: action.title, done: false }];
  case 'REMOVE_TASK': {
    const newState = [...state];
    newState.splice(action.index, 1);
    return newState;
  }
  case 'EDIT_TASK': {
    const newState = [...state];
    const { index, title, done } = action;
    if (typeof title === 'string') newState[index].title = title;
    if (typeof done === 'boolean') newState[index].done = done;
    return newState;
  }
  default:
    return state;
  }
}

export default taskReducer;
