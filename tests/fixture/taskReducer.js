const initialState = { title: 'Title', description: 'Description' };

function taskReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return {...state, title: action.title};
    case 'CHANGE_DESCRIPTION':
      return {...state, description: action.description};
    default:
      return state;
  }
}

module.exports = { taskReducer, initialState };
