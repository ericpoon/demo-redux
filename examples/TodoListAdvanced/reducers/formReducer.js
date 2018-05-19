const initialState = { title: '' };

function formReducer(state = initialState, action) {
  switch (action.type) {
  case 'CHANGE_TITLE_INPUT_VALUE':
    return { ...state, title: action.title };
  default:
    return state;
  }
}

export default formReducer;
