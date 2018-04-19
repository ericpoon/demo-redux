function createStore(initialState, reducer, enhancer) {
  let _state = initialState;

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(initialState, reducer);
  }

  return {
    dispatch(action) {
      if (typeof action === 'object' && !Array.isArray(action)) {
        _state = reducer(_state, action);
      } else {
        throw new Error('Redux: Action must be an object');
      }
    },
    getState() {
      return _state;
    },
  };
}

module.exports = createStore;
