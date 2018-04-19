function thunk(createStore) {
  function enhancedCreateStore(initialState, reducer, enhancer) {
    if (typeof enhancer === 'function') {
      return enhancer(enhancedCreateStore)(initialState, reducer);
    }
    const store = createStore(initialState, reducer);

    return {
      dispatch(action) {
        if (typeof action === 'function') {
          action(store.dispatch, store.getState);
        } else {
          store.dispatch(action);
        }
      },
      getState() {
        return store.getState();
      },
    };
  }

  return enhancedCreateStore;
}

module.exports = thunk;
