const initialState = [];

function stackReducer(state = initialState, action) {
  switch (action.type) {
    case 'PUSH':
      return [...state, action.item];
    case 'POP': {
      if (state.length === 0) {
        throw new Error('Stack Reducer: Cannot pop an empty stack');
      }
      return state.slice(0, state.length - 1)
    }
  }
}

module.exports = { stackReducer, initialState };
