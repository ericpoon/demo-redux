function thunk(createStore) {
  function enhancedCreateStore(reducer, initialState, enhancer) {
    if (typeof enhancer === 'function') {
      return enhancer(enhancedCreateStore)(reducer, initialState);
    }
    const store = createStore(reducer, initialState);

    return {
      ...store,
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
